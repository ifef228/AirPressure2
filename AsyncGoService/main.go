package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"os/signal"
	"sync"
	"syscall"
	"time"
)

// Task представляет асинхронную задачу
type Task struct {
	ID        string    `json:"id"`
	Type      string    `json:"type"`
	Data      string    `json:"data"`
	Status    string    `json:"status"`
	Result    string    `json:"result,omitempty"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// TaskService управляет задачами
type TaskService struct {
	tasks           map[string]*Task
	taskQueue       chan *Task
	workers         int
	mu              sync.RWMutex
	wg              sync.WaitGroup
	stopChan        chan struct{}
	mainServiceURL  string
	asyncToken      string
	httpClient      *http.Client
}

// NewTaskService создает новый сервис задач
func NewTaskService(workers int, queueSize int, mainServiceURL string, asyncToken string) *TaskService {
	ts := &TaskService{
		tasks:          make(map[string]*Task),
		taskQueue:      make(chan *Task, queueSize),
		workers:        workers,
		stopChan:       make(chan struct{}),
		mainServiceURL: mainServiceURL,
		asyncToken:     asyncToken,
		httpClient: &http.Client{
			Timeout: 30 * time.Second,
		},
	}

	// Запускаем воркеры
	for i := 0; i < workers; i++ {
		ts.wg.Add(1)
		go ts.worker(i)
	}

	return ts
}

// worker обрабатывает задачи из очереди
func (ts *TaskService) worker(id int) {
	defer ts.wg.Done()
	log.Printf("Worker %d started", id)

	for {
		select {
		case task := <-ts.taskQueue:
			log.Printf("Worker %d processing task %s", id, task.ID)
			ts.processTask(task)
		case <-ts.stopChan:
			log.Printf("Worker %d stopped", id)
			return
		}
	}
}

// processTask выполняет задачу асинхронно
func (ts *TaskService) processTask(task *Task) {
	ts.mu.Lock()
	task.Status = "processing"
	task.UpdatedAt = time.Now()
	ts.mu.Unlock()

	// Имитация длительной операции (расчет температуры)
	time.Sleep(5 * time.Second)

	// Парсим данные задачи для получения calcOrderId и gasId
	var calcOrderId, gasId int64
	fmt.Sscanf(task.Data, "%d:%d", &calcOrderId, &gasId)

	// Обработка в зависимости от типа задачи
	var result string
	var resultValue float64

	if task.Type == "calculate" && calcOrderId > 0 && gasId > 0 {
		// Рассчитываем температуру по формуле на основе gasId
		// Используем упрощенную формулу, аналогичную той, что в Kotlin сервисе
		resultValue = ts.calculateTemperatureForGas(gasId)
		result = fmt.Sprintf("Temperature calculated for gas %d: %.2f°C", gasId, resultValue)
	} else {
		// Для других типов задач используем простые значения
		switch task.Type {
		case "process":
			result = fmt.Sprintf("Processed: %s", task.Data)
			resultValue = 20.0
		case "transform":
			result = fmt.Sprintf("Transformed: %s", task.Data)
			resultValue = 18.3
		default:
			result = fmt.Sprintf("Completed: %s", task.Data)
			resultValue = 16.0
		}
	}

	ts.mu.Lock()
	task.Status = "completed"
	task.Result = result
	task.UpdatedAt = time.Now()
	ts.mu.Unlock()

	log.Printf("Task %s completed with result: %.2f", task.ID, resultValue)

	// Отправляем результат обратно в основной сервис, если указан URL
	if ts.mainServiceURL != "" && task.Data != "" && calcOrderId > 0 && gasId > 0 {
		ts.sendResultToMainService(task, resultValue)
	}
}

// calculateTemperatureForGas рассчитывает температуру для конкретного газа
// Использует упрощенную формулу на основе типа газа
func (ts *TaskService) calculateTemperatureForGas(gasId int64) float64 {
	// Базовая температура атмосферы
	baseTemp := 15.0

	// Парниковый эффект в зависимости от типа газа
	var greenhouseEffect float64
	switch gasId {
	case 1: // CO₂ - основной парниковый газ
		greenhouseEffect = 0.8
	case 2: // O₂ - незначительный парниковый эффект
		greenhouseEffect = 0.01
	case 3: // Ar - инертный газ, не влияет
		greenhouseEffect = 0.0
	case 4: // N₂ - незначительный парниковый эффект
		greenhouseEffect = 0.02
	case 5: // H₂O - сильный парниковый газ
		greenhouseEffect = 1.2
	default:
		greenhouseEffect = 0.1 // Среднее значение для неизвестных газов
	}

	// Рассчитываем итоговую температуру
	finalTemp := baseTemp + greenhouseEffect

	// Ограничиваем разумными пределами (-50°C до +50°C)
	if finalTemp < -50.0 {
		finalTemp = -50.0
	} else if finalTemp > 50.0 {
		finalTemp = 50.0
	}

	// Округляем до 2 знаков после запятой
	return float64(int(finalTemp*100+0.5)) / 100.0
}

// sendResultToMainService отправляет результат в основной сервис
func (ts *TaskService) sendResultToMainService(task *Task, resultValue float64) {
	log.Printf("=== sendResultToMainService START for task %s ===", task.ID)
	log.Printf("Task %s: task.Data=%s, resultValue=%.2f", task.ID, task.Data, resultValue)

	// Парсим данные задачи для получения calcOrderId и gasId
	// Предполагаем формат: "calcOrderId:gasId" или JSON
	var calcOrderId, gasId int64
	n, err := fmt.Sscanf(task.Data, "%d:%d", &calcOrderId, &gasId)
	log.Printf("Task %s: parsed calcOrderId=%d, gasId=%d, parsed items=%d, error=%v", task.ID, calcOrderId, gasId, n, err)

	if calcOrderId == 0 || gasId == 0 {
		log.Printf("Task %s: ERROR - cannot parse calcOrderId and gasId from data: %s", task.ID, task.Data)
		return
	}

	// Формируем запрос
	requestBody := map[string]interface{}{
		"results": []map[string]interface{}{
			{
				"calcOrderId": calcOrderId,
				"gasId":       gasId,
				"result":      resultValue,
			},
		},
	}

	log.Printf("Task %s: requestBody: calcOrderId=%d, gasId=%d, result=%.2f", task.ID, calcOrderId, gasId, resultValue)

	jsonData, err := json.Marshal(requestBody)
	if err != nil {
		log.Printf("Task %s: ERROR marshaling request: %v", task.ID, err)
		return
	}
	log.Printf("Task %s: JSON data: %s", task.ID, string(jsonData))

	url := ts.mainServiceURL + "/api/gas-orders/async-results"
	log.Printf("Task %s: sending POST to: %s", task.ID, url)

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		log.Printf("Task %s: ERROR creating request: %v", task.ID, err)
		return
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-Async-Token", ts.asyncToken)
	log.Printf("Task %s: headers set, token: %s", task.ID, ts.asyncToken)

	resp, err := ts.httpClient.Do(req)
	if err != nil {
		log.Printf("Task %s: ERROR sending result to main service: %v", task.ID, err)
		return
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	log.Printf("Task %s: response status: %d", task.ID, resp.StatusCode)
	log.Printf("Task %s: response body: %s", task.ID, string(body))

	if resp.StatusCode != http.StatusOK {
		log.Printf("Task %s: ERROR - main service returned status %d: %s", task.ID, resp.StatusCode, string(body))
		return
	}

	log.Printf("Task %s: SUCCESS - result successfully sent to main service", task.ID)
	log.Printf("=== sendResultToMainService END for task %s ===", task.ID)
}

// AddTask добавляет задачу в очередь
func (ts *TaskService) AddTask(taskType, data string) *Task {
	task := &Task{
		ID:        fmt.Sprintf("task-%d", time.Now().UnixNano()),
		Type:      taskType,
		Data:      data,
		Status:    "pending",
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	ts.mu.Lock()
	ts.tasks[task.ID] = task
	ts.mu.Unlock()

	// Отправляем задачу в очередь асинхронно
	go func() {
		ts.taskQueue <- task
		log.Printf("Task %s added to queue", task.ID)
	}()

	return task
}

// GetTask возвращает задачу по ID
func (ts *TaskService) GetTask(id string) (*Task, bool) {
	ts.mu.RLock()
	defer ts.mu.RUnlock()
	task, exists := ts.tasks[id]
	return task, exists
}

// GetAllTasks возвращает все задачи
func (ts *TaskService) GetAllTasks() []*Task {
	ts.mu.RLock()
	defer ts.mu.RUnlock()

	tasks := make([]*Task, 0, len(ts.tasks))
	for _, task := range ts.tasks {
		tasks = append(tasks, task)
	}
	return tasks
}

// Stop останавливает сервис
func (ts *TaskService) Stop() {
	close(ts.stopChan)
	ts.wg.Wait()
	log.Println("TaskService stopped")
}

// HTTP handlers

func (ts *TaskService) createTaskHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req struct {
		Type string `json:"type"`
		Data string `json:"data"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	task := ts.AddTask(req.Type, req.Data)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(task)
}

func (ts *TaskService) getTaskHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	id := r.URL.Query().Get("id")
	if id == "" {
		http.Error(w, "Task ID is required", http.StatusBadRequest)
		return
	}

	task, exists := ts.GetTask(id)
	if !exists {
		http.Error(w, "Task not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(task)
}

func (ts *TaskService) getAllTasksHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	tasks := ts.GetAllTasks()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"tasks": tasks,
		"count": len(tasks),
	})
}

func (ts *TaskService) healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":    "healthy",
		"timestamp": time.Now().Unix(),
		"workers":   ts.workers,
		"queue_size": len(ts.taskQueue),
	})
}

func main() {
	// Получаем URL основного сервиса из переменной окружения или используем значение по умолчанию
	mainServiceURL := os.Getenv("MAIN_SERVICE_URL")
	if mainServiceURL == "" {
		mainServiceURL = "http://localhost:8080" // Значение по умолчанию
	}

	// Токен для авторизации (8 байт)
	asyncToken := os.Getenv("ASYNC_TOKEN")
	if asyncToken == "" {
		asyncToken = "async123" // Значение по умолчанию
	}

	// Создаем сервис задач с 3 воркерами и очередью на 100 задач
	taskService := NewTaskService(3, 100, mainServiceURL, asyncToken)

	// Настраиваем HTTP маршруты
	http.HandleFunc("/api/tasks", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			taskService.createTaskHandler(w, r)
		case http.MethodGet:
			if r.URL.Query().Get("id") != "" {
				taskService.getTaskHandler(w, r)
			} else {
				taskService.getAllTasksHandler(w, r)
			}
		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})

	http.HandleFunc("/api/health", taskService.healthHandler)

	// Обработчик для корневого пути
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{
			"message": "AsyncGoService API",
			"version": "1.0.0",
			"endpoints": "/api/tasks, /api/health",
		})
	})

	// Настройка graceful shutdown
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, os.Interrupt, syscall.SIGTERM)

	server := &http.Server{
		Addr:    ":8081",
		Handler: nil,
	}

	// Запускаем сервер в отдельной горутине
	go func() {
		log.Println("AsyncGoService starting on :8081")
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server failed: %v", err)
		}
	}()

	// Ждем сигнал для остановки
	<-sigChan
	log.Println("Shutting down server...")

	// Останавливаем сервис задач
	taskService.Stop()

	// Останавливаем HTTP сервер
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Printf("Server shutdown error: %v", err)
	}

	log.Println("Server stopped")
}
