import { FaExclamationTriangle, FaExclamationCircle, FaInfoCircle, FaCheckCircle, FaTools, FaRedoAlt } from 'react-icons/fa';

interface AlertMessageProps {
  message: string;
  severity: 'error' | 'warning' | 'info' | 'success';
  description?: string;
}

const AlertMessage = ({ message, severity, description }: AlertMessageProps) => {
  const severityConfig = {
    error: {
      icon: FaExclamationCircle,
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      borderColor: 'border-red-200',
      iconColor: 'text-red-600',
      gradientFrom: 'from-red-600',
      gradientVia: 'via-red-800',
      gradientTo: 'to-red-600',
      title: 'Ops! Algo deu errado',
      defaultDescription: 'Estamos cientes do problema e nossa equipe já está trabalhando para resolvê-lo o mais rápido possível.'
    },
    warning: {
      icon: FaExclamationTriangle,
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
      borderColor: 'border-yellow-200',
      iconColor: 'text-yellow-600',
      gradientFrom: 'from-yellow-500',
      gradientVia: 'via-yellow-700',
      gradientTo: 'to-yellow-500',
      title: 'Atenção!',
      defaultDescription: 'Identificamos uma situação que requer sua atenção.'
    },
    info: {
      icon: FaInfoCircle,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-600',
      gradientFrom: 'from-blue-500',
      gradientVia: 'via-blue-700',
      gradientTo: 'to-blue-500',
      title: 'Informação Importante',
      defaultDescription: 'Aqui está uma informação relevante para você.'
    },
    success: {
      icon: FaCheckCircle,
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200',
      iconColor: 'text-green-600',
      gradientFrom: 'from-green-500',
      gradientVia: 'via-green-700',
      gradientTo: 'to-green-500',
      title: 'Tudo certo!',
      defaultDescription: 'A operação foi concluída com sucesso.'
    },
  };

  const config = severityConfig[severity];
  const Icon = config.icon;

  return (
    <div className="min-h-[300px] flex items-center justify-center p-6">
      <div className={`w-full max-w-3xl ${config.bgColor} border-2 ${config.borderColor} rounded-xl shadow-xl overflow-hidden`}>
        {/* Faixa superior com gradiente */}
        <div className={`h-4 bg-gradient-to-r ${config.gradientFrom} ${config.gradientVia} ${config.gradientTo}`}></div>
        
        <div className="p-8">
          {/* Ícone principal e título */}
          <div className="flex items-center justify-center mb-6">
            <div className={`p-4 rounded-full ${config.bgColor} border-2 ${config.borderColor}`}>
              <Icon className={`w-16 h-16 ${config.iconColor}`} />
            </div>
          </div>
          
          <div className="text-center space-y-4">
            <h2 className={`text-2xl font-bold ${config.textColor}`}>
              {config.title}
            </h2>
            
            <p className={`text-lg ${config.textColor}`}>
              {message}
            </p>
            
            <p className={`text-sm opacity-80 ${config.textColor}`}>
              {description || config.defaultDescription}
            </p>
          </div>

          {/* Área de status/ações */}
          <div className="mt-8 pt-6 border-t border-opacity-20 flex items-center justify-center space-x-2 text-sm">
            {severity === 'error' && (
              <>
                <FaTools className={`w-4 h-4 ${config.iconColor}`} />
                <span className={`${config.textColor}`}>Manutenção em andamento</span>
                <FaRedoAlt className={`w-4 h-4 ${config.iconColor} animate-spin`} />
              </>
            )}
          </div>
        </div>

        {/* Faixa inferior com gradiente */}
        <div className={`h-4 bg-gradient-to-r ${config.gradientFrom} ${config.gradientVia} ${config.gradientTo}`}></div>
      </div>
    </div>
  );
};

export default AlertMessage; 
