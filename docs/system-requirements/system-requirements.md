# РАСЧЕТ СИСТЕМНЫХ ТРЕБОВАНИЙ
**Веб-приложение "Калькулятор температуры атмосферы"** | ГОСТ 34.602-2020

## 1. ОПЕРАТИВНАЯ ПАМЯТЬ (ОЗУ)

RAM<sub>total</sub> = RAM<sub>os</sub> + RAM<sub>frontend</sub> + RAM<sub>backend</sub> + RAM<sub>db</sub> + RAM<sub>redis</sub> + RAM<sub>minio</sub> + RAM<sub>buffer</sub>     (1)

Dev: RAM = 2 + 1 + 1.2 + 0.4 + 0.12 + 0.5 + 1.3 = **6.5 ГБ**     (2)
Prod: RAM = 2 + 0.15 + 2.5 + 2.5 + 1 + 1 + 2.7 = **11.85 ГБ**     (3)

Heap<sub>JVM</sub> = Base + (Users × Memory<sub>per_user</sub>)     (4)

Dev: Heap = 256 + (100 × 2) = 456 МБ ≈ **512 МБ**     (5)
Prod: Heap = 512 + (500 × 2) = 1512 МБ ≈ **2048 МБ**     (6)

## 2. ПРОЦЕССОР (CPU)

RPS = (Users × Requests<sub>per_min</sub>) / 60     (7)

Dev: RPS = (100 × 10) / 60 = **17 RPS**     (8)
Prod: RPS = (500 × 6) / 60 = **50 RPS**     (9)

CPU<sub>cores</sub> = Threads<sub>total</sub> / Ratio     (10)

Dev: CPU = 20 / 4 = **5 ядер**     (11)
Prod: CPU = (200 + 100) × 0.15 / 4 = **11.25 ядер**     (12)

## 3. ДИСКОВОЕ ПРОСТРАНСТВО

Disk<sub>total</sub> = Disk<sub>os</sub> + Disk<sub>data</sub> + Disk<sub>logs</sub> + Disk<sub>backup</sub> + Disk<sub>temp</sub>     (13)

Dev: Disk = 22 + 2.5 + 5 + 0 + 2 = **31.5 ГБ**     (14)
Prod: Disk = 22 + 8.5 + 20 + 2 + 5 = **57.5 ГБ**     (15)
Prod (резерв 50%): Disk = 57.5 × 1.5 = **87 ГБ**     (16)

Table<sub>size</sub> = Row<sub>size</sub> × Rows × Index<sub>factor</sub>     (17)

IOPS = RPS × Queries × IOPS<sub>per_query</sub>     (18)
Prod: IOPS = 50 × 3 × 2 = **300 IOPS**     (19)

## 4. ИТОГОВЫЕ ТРЕБОВАНИЯ

| Параметр | Development | Production |
|----------|-------------|------------|
| **ОЗУ** | 8 ГБ | 16 ГБ |
| **CPU** | 4 ядра, 2.5 ГГц | 8 ядер, 3.0 ГГц |
| **Диск** | 50 ГБ SSD | 128 ГБ SSD |
| **IOPS** | — | ≥ 300 (SSD/NVMe) |

**2024**
