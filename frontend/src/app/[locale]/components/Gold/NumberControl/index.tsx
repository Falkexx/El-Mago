// NumberControl.tsx
import React from 'react';

interface NumberControlProps {
  value: number;
}

const NumberControl: React.FC<NumberControlProps> = ({ value }) => {
  return (
    <div className="w-full h-12 relative">
      {/* Container principal */}
      <div className="w-full h-12 rounded-lg border border-[#495057] flex items-center justify-around">
        {/* Botão de decrementar */}
        <div 
          className="w-6 h-6 cursor-pointer"
        >
          <div className="w-5 h-5 bg-Neutral-800 flex items-center justify-center">
            <span className="text-Neutral-100 text-lg">-</span>
          </div>
        </div>

        {/* Valor central */}
        <div className="text-Neutral-100 text-xl font-normal font-['Jost'] leading-[30px]">
          {value}
        </div>

        {/* Botão de incrementar */}
        <div 
          className="w-6 h-6 cursor-pointer"
        >
          <div className="w-5 h-5 bg-Neutral-800 flex items-center justify-center">
            <span className="text-Neutral-100 text-lg">+</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Exemplo de uso no componente pai
const ParentComponent: React.FC = () => {
  const [count, setCount] = React.useState<number>(2000);

  const handleIncrement = (): void => {
    setCount(prev => prev + 1);
  };

  const handleDecrement = (): void => {
    setCount(prev => prev - 1);
  };

  return (
    <NumberControl 
      value={count}

    />
  );
};

export default NumberControl;