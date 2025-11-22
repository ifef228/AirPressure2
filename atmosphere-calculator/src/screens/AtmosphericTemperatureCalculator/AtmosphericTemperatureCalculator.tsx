import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { useCart } from "../../contexts/CartContext";
import { Input } from "../../components/ui/input";

const atmosphericGases = [
  {
    id: 1,
    name: "CO₂ (Углекислый газ)",
    concentration: "0.04%",
    temperature: "15°C",
    image: "https://c.animaapp.com/mfi4rqisUqRMxb/img/image-5.png",
  },
  {
    id: 2,
    name: "O₂ (Кислород)",
    concentration: "20.95%",
    temperature: "15°C",
    image: "https://c.animaapp.com/mfi4rqisUqRMxb/img/image-12.png",
  },
  {
    id: 3,
    name: "Ar (Аргон)",
    concentration: "0.93%",
    temperature: "15°C",
    image: "https://c.animaapp.com/mfi4rqisUqRMxb/img/image-13.png",
  },
  {
    id: 4,
    name: "N₂ (Азот)",
    concentration: "78.08%",
    temperature: "15°C",
    image: "https://c.animaapp.com/mfi4rqisUqRMxb/img/image-14.png",
  },
  {
    id: 5,
    name: "H₂O (Водяной пар)",
    concentration: "0-4%",
    temperature: "15°C",
    image: "https://c.animaapp.com/mfi4rqisUqRMxb/img/image-15.png",
  },
];

export const AtmosphericTemperatureCalculator = (): JSX.Element => {
  const { addToCart, isInCart, getCartItemsCount } = useCart();
  const navigate = useNavigate();


  const handleCartClick = () => {
    navigate("/temperature-calculation");
  };

  const handleGasClick = (gasId: number) => {
    navigate(`/atmospheric-gas/${gasId}`);
  };

  return (
    <div
      className="gas_page"
      data-model-id="14:69"
    >
      {/* Header */}
      <header className="gas_header w-full h-[164px] translate-y-[-1rem] animate-fade-in opacity-0">
        <div className="container mx-auto px-8 py-8 flex items-center gap-4">
          <h1 className="text-4xl font-bold gas_text_primary tracking-[-0.70px] [font-family:'Inter',Helvetica]">
            AtmosphericTempCalc
          </h1>
          <img
            className="w-[110px] h-[110px] object-cover"
            alt="AtmosphereTemp Logo"
            src="http://localhost:9001/api/v1/download-shared-object/aHR0cDovLzEyNy4wLjAuMTo5MDAwL2NhcmRzL3Bob3Rvcy9kZWZhdWx0X21hcmtldC53ZWJwP1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9OFgzOElWTTA2T1pCTEcxUjFWV0UlMkYyMDI1MTAxNyUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNTEwMTdUMDYyNTE4WiZYLUFtei1FeHBpcmVzPTQzMjAwJlgtQW16LVNlY3VyaXR5LVRva2VuPWV5SmhiR2NpT2lKSVV6VXhNaUlzSW5SNWNDSTZJa3BYVkNKOS5leUpoWTJObGMzTkxaWGtpT2lJNFdETTRTVlpOTURaUFdrSk1SekZTTVZaWFJTSXNJbVY0Y0NJNk1UYzJNRGN5TkRrNU9Td2ljR0Z5Wlc1MElqb2lZV1J0YVc0aWZRLk5GMXZyU3lyQnBRQXRxcGcwQXkzU25obDhlZXg2VTNOdjJUdDFXbklBQ2NiVEJXQkhxczltVUVPMnhkSVJ5OXB4LTNLQS1mM1poN1pFNHJ3ZV9yOTJBJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZ2ZXJzaW9uSWQ9bnVsbCZYLUFtei1TaWduYXR1cmU9MjU3NmI5NmJkYjFjNDMwZmQzYjExNmY4MmE3YmY5ZGQxZTBlZjBlNTVmMjIxNWU3MzJkNDY4ZWViMTYxYjY4Zg"
          />
        </div>
      </header>

      {/* Search Section */}
      <section className="w-full py-8 translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms]">
        <div className="container mx-auto px-8">
          <div className="flex justify-center">
            <div className="flex items-center gap-4 max-w-md w-full">
              <div className="flex-1 h-[60px] gas_search">
                <Input
                  className="w-full h-full bg-transparent border-0 px-4 placeholder:text-[#828282] placeholder:font-small-text placeholder:text-[length:var(--small-text-font-size)]"
                  placeholder="Поиск атмосферного газа"
                />
              </div>
              <Button className="gas_btn w-[60px] h-[60px] flex items-center justify-center">
                <span className="text-2xl">🔍</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Atmospheric Gases Temperature Calculation Grid */}
      <main className="w-full py-8">
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {atmosphericGases.map((gas, index) => (
              <Card
                key={gas.id}
                className="gas_card relative w-full h-[250px] translate-y-[-1rem] animate-fade-in opacity-0 cursor-pointer"
                style={{
                  animationDelay: `${400 + index * 200}ms`,
                }}
                onClick={() => handleGasClick(gas.id)}
              >
            <CardContent className="relative w-full h-full p-6 flex items-center gap-6">
              {/* Image Section */}
              <div className="flex-shrink-0">
                <img
                  className="w-[120px] h-[120px] object-cover rounded-lg"
                  alt={gas.name}
                  src={gas.image}
                />
              </div>

              {/* Content Section */}
              <div className="flex-1 flex flex-col justify-center gap-3">
                <h3 className="text-2xl font-semibold gas_text_primary leading-tight">
                  {gas.name}
                </h3>
                <div className="space-y-1">
                  <p className="text-sm gas_text_secondary">
                    <span className="font-medium">Концентрация:</span> {gas.concentration}
                  </p>
                  <p className="text-sm gas_text_secondary">
                    <span className="font-medium">Температура:</span> {gas.temperature}
                  </p>
                </div>
              </div>

              {/* Button Section */}
              <div className="flex-shrink-0">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(gas.id);
                  }}
                  className="gas_btn w-[120px] h-[50px]"
                >
                  <span className="text-xs font-medium text-center leading-tight">
                    {isInCart(gas.id) ? "в корзине" : "в корзину"}
                  </span>
                </Button>
              </div>
            </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* Shopping Cart - Fixed Position */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          {/* Cart Icon */}
          <div
            onClick={getCartItemsCount() > 0 ? handleCartClick : undefined}
            className={`w-16 h-16 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${
              getCartItemsCount() > 0
                ? "gas_cart cursor-pointer hover:shadow-xl hover:scale-110"
                : "gas_cart_empty"
            }`}
          >
            <span className="text-2xl">🛒</span>
          </div>

          {/* Cart Count Badge */}
          {getCartItemsCount() > 0 && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg animate-pulse">
              {getCartItemsCount()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
