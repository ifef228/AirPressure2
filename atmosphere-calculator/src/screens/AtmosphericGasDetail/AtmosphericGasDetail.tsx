import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

interface NumericalValue {
  value: string;
  unit: string;
  label: string;
  note?: string;
}

// Расширенные данные о газах с ценами
const gasDetails = {
  1: {
    id: 1,
    name: "CO₂ (Углекислый газ)",
    fullName: "Диоксид углерода",
    concentration: "0.04%",
    temperature: "15°C",
    image: "https://c.animaapp.com/mfi4rqisUqRMxb/img/image-5.png",
    description: "Углекислый газ - это бесцветный газ без запаха, который является важной частью углеродного цикла Земли. Он играет ключевую роль в парниковом эффекте и является основным продуктом сгорания органических веществ.",
    numericalValues: {
      molarMass: { value: "44.01", unit: "г/моль", label: "Молярная масса" } as NumericalValue,
      density: { value: "1.977", unit: "г/л", label: "Плотность", note: "при 0°C" } as NumericalValue,
      boilingPoint: { value: "-78.5", unit: "°C", label: "Температура кипения" } as NumericalValue
    },
    properties: [
      "Молекулярная формула: CO₂",
      "Растворимость в воде: высокая"
    ],
    applications: [
      "Пищевая промышленность (газированные напитки)",
      "Огнетушители",
      "Сварочные работы",
      "Холодильная техника",
      "Сельское хозяйство (парниковый эффект)"
    ]
  },
  2: {
    id: 2,
    name: "O₂ (Кислород)",
    fullName: "Молекулярный кислород",
    concentration: "20.95%",
    temperature: "15°C",
    image: "https://c.animaapp.com/mfi4rqisUqRMxb/img/image-12.png",
    description: "Кислород - это химический элемент, жизненно необходимый для большинства живых организмов. Он составляет около 21% атмосферы Земли и является ключевым компонентом для дыхания.",
    numericalValues: {
      molarMass: { value: "32.00", unit: "г/моль", label: "Молярная масса" } as NumericalValue,
      density: { value: "1.429", unit: "г/л", label: "Плотность", note: "при 0°C" } as NumericalValue,
      boilingPoint: { value: "-183", unit: "°C", label: "Температура кипения" } as NumericalValue
    },
    properties: [
      "Молекулярная формула: O₂",
      "Цвет: бесцветный"
    ],
    applications: [
      "Медицина (дыхательная терапия)",
      "Металлургия (сталеплавильное производство)",
      "Акваланги и космические корабли",
      "Химическая промышленность",
      "Очистка сточных вод"
    ]
  },
  3: {
    id: 3,
    name: "Ar (Аргон)",
    fullName: "Аргон",
    concentration: "0.93%",
    temperature: "15°C",
    image: "https://c.animaapp.com/mfi4rqisUqRMxb/img/image-13.png",
    description: "Аргон - это благородный газ, который составляет около 1% атмосферы Земли. Он инертен и не вступает в химические реакции при обычных условиях, что делает его полезным для различных промышленных применений.",
    numericalValues: {
      atomicMass: { value: "39.95", unit: "г/моль", label: "Атомная масса" } as NumericalValue,
      density: { value: "1.784", unit: "г/л", label: "Плотность", note: "при 0°C" } as NumericalValue,
      boilingPoint: { value: "-185.8", unit: "°C", label: "Температура кипения" } as NumericalValue
    },
    properties: [
      "Атомная формула: Ar",
      "Инертный газ"
    ],
    applications: [
      "Сварочные работы (защитная атмосфера)",
      "Лампы накаливания",
      "Криогенные применения",
      "Научные исследования",
      "Пищевая промышленность (упаковка)"
    ]
  },
  4: {
    id: 4,
    name: "N₂ (Азот)",
    fullName: "Молекулярный азот",
    concentration: "78.08%",
    temperature: "15°C",
    image: "https://c.animaapp.com/mfi4rqisUqRMxb/img/image-14.png",
    description: "Азот - это самый распространенный газ в атмосфере Земли, составляющий около 78% её объёма. Он является основным компонентом белков и ДНК, что делает его жизненно важным для всех живых организмов.",
    numericalValues: {
      molarMass: { value: "28.01", unit: "г/моль", label: "Молярная масса" } as NumericalValue,
      density: { value: "1.251", unit: "г/л", label: "Плотность", note: "при 0°C" } as NumericalValue,
      boilingPoint: { value: "-195.8", unit: "°C", label: "Температура кипения" } as NumericalValue
    },
    properties: [
      "Молекулярная формула: N₂",
      "Инертный при обычных условиях"
    ],
    applications: [
      "Производство аммиака и удобрений",
      "Пищевая промышленность (упаковка)",
      "Электроника (защитная атмосфера)",
      "Медицина (криотерапия)",
      "Автомобильная промышленность"
    ]
  },
  5: {
    id: 5,
    name: "H₂O (Водяной пар)",
    fullName: "Водяной пар",
    concentration: "0-4%",
    temperature: "15°C",
    image: "https://c.animaapp.com/mfi4rqisUqRMxb/img/image-15.png",
    description: "Водяной пар - это газообразное состояние воды, которое играет важную роль в климатических процессах. Его концентрация в атмосфере сильно варьируется в зависимости от температуры и влажности.",
    numericalValues: {
      molarMass: { value: "18.02", unit: "г/моль", label: "Молярная масса" } as NumericalValue,
      density: { value: "0.804", unit: "г/л", label: "Плотность", note: "при 100°C" } as NumericalValue,
      boilingPoint: { value: "100", unit: "°C", label: "Температура кипения" } as NumericalValue
    },
    properties: [
      "Молекулярная формула: H₂O",
      "Парниковый газ"
    ],
    applications: [
      "Климатические системы",
      "Пищевая промышленность",
      "Фармацевтика",
      "Энергетика (паровые турбины)",
      "Сельское хозяйство"
    ]
  }
};

export const AtmosphericGasDetail = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const gasId = parseInt(id || "1");
  const gas = gasDetails[gasId as keyof typeof gasDetails];

  if (!gas) {
    return (
      <div className="min-h-screen bg-[#e1e1e1] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Газ не найден</h1>
          <Button onClick={() => navigate("/")} className="bg-[#dff0a5] hover:bg-[#dff0a5ad]">
            Вернуться на главную
          </Button>
        </div>
      </div>
    );
  }

  const handleBackClick = () => {
    navigate("/");
  };

  return (
    <div className="relative min-h-screen w-full bg-[#e1e1e1]">
      {/* Header */}
      <header className="w-full h-[164px] bg-[#f8f8f8] translate-y-[-1rem] animate-fade-in opacity-0">
        <div className="container mx-auto px-8 py-8 flex items-center gap-4">
          <Button
            onClick={handleBackClick}
            className="gas_btn_secondary w-[50px] h-[50px] rounded-lg shadow-md flex items-center justify-center"
          >
            <span className="text-xl">🏠</span>
          </Button>
          <h1 className="text-4xl font-bold text-black tracking-[-0.70px] [font-family:'Inter',Helvetica]">
            AtmosphericTempCalc
          </h1>
          <img
            className="w-[110px] h-[110px] object-cover"
            alt="AtmosphereTemp Logo"
            src="http://localhost:9001/api/v1/download-shared-object/aHR0cDovLzEyNy4wLjAuMTo5MDAwL2NhcmRzL3Bob3Rvcy9kZWZhdWx0X21hcmtldC53ZWJwP1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9OFgzOElWTTA2T1pCTEcxUjFWV0UlMkYyMDI1MTAxNyUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNTEwMTdUMDYyNTE4WiZYLUFtei1FeHBpcmVzPTQzMjAwJlgtQW16LVNlY3VyaXR5LVRva2VuPWV5SmhiR2NpT2lKSVV6VXhNaUlzSW5SNWNDSTZJa3BYVkNKOS5leUpoWTJObGMzTkxaWGtpT2lJNFdETTRTVlpOTURaUFdrSk1SekZTTVZaWFJTSXNJbVY0Y0NJNk1UYzJNRGN5TkRrNU9Td2ljR0Z5Wlc1MElqb2lZV1J0YVc0aWZRLk5GMXZyU3lyQnBRQXRxcGcwQXkzU25obDhlZXg2VTNOdjJUdDFXbklBQ2NiVEJXQkhxczltVUVPMnhkSVJ5OXB4LTNLQS1mM1poN1pFNHJ3ZV9yOTJBJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZ2ZXJzaW9uSWQ9bnVsbCZYLUFtei1TaWduYXR1cmU9MjU3NmI5NmJkYjFjNDMwZmQzYjExNmY4MmE3YmY5ZGQxZTBlZjBlNTVmMjIxNWU3MzJkNDY4ZWViMTYxYjY4Zg"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full py-8">
        <div className="container mx-auto px-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Image and Basic Info */}
            <div className="space-y-6">
              <Card className="bg-white shadow-lg border border-gray-200 rounded-xl">
                <CardContent className="p-8">
                  <div className="text-center">
                    <img
                      className="w-[200px] h-[200px] object-cover rounded-lg mx-auto mb-6"
                      alt={gas.name}
                      src={gas.image}
                    />
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                      {gas.name}
                    </h2>
                    <p className="text-lg text-gray-600 mb-4">
                      {gas.fullName}
                    </p>
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* Right Column - Detailed Information */}
            <div className="space-y-6">
              {/* Description */}
              <Card className="bg-white shadow-lg border border-gray-200 rounded-xl">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Описание
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {gas.description}
                  </p>
                </CardContent>
              </Card>

              {/* Properties */}
              <Card className="bg-white shadow-lg border border-gray-200 rounded-xl">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Физические свойства
                  </h3>
                  <ul className="space-y-2">
                    {gas.properties.map((property, index) => (
                      <li key={index} className="text-gray-600 flex items-start">
                        <span className="text-[#dff0a5] mr-2">•</span>
                        {property}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Applications */}
              <Card className="bg-white shadow-lg border border-gray-200 rounded-xl">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Применение
                  </h3>
                  <ul className="space-y-2">
                    {gas.applications.map((application, index) => (
                      <li key={index} className="text-gray-600 flex items-start">
                        <span className="text-[#dff0a5] mr-2">•</span>
                        {application}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Atmospheric Data */}
              <Card className="bg-white shadow-lg border border-gray-200 rounded-xl">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Атмосферные данные
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#f8f8f8] rounded-lg p-4">
                      <div className="text-sm text-gray-500 mb-1">Концентрация</div>
                      <div className="text-lg font-semibold text-gray-800">
                        {gas.concentration}
                      </div>
                    </div>
                    <div className="bg-[#f8f8f8] rounded-lg p-4">
                      <div className="text-sm text-gray-500 mb-1">Температура</div>
                      <div className="text-lg font-semibold text-gray-800">
                        {gas.temperature}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Numerical Values */}
              <Card className="bg-white shadow-lg border border-gray-200 rounded-xl">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Физические характеристики
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(gas.numericalValues).map(([key, value]) => (
                      <div key={key} className="bg-[#f8f8f8] rounded-lg p-4">
                        <div className="text-sm text-gray-500 mb-1">{value.label}</div>
                        <div className="text-lg font-semibold text-gray-800">
                          {value.value} <span className="text-sm text-gray-600">{value.unit}</span>
                        </div>
                        {value.note && (
                          <div className="text-xs text-gray-400 mt-1">{value.note}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
