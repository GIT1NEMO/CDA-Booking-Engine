import React from 'react';
import { Calendar, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface DateConfirmationProps {
  selectedDate: string;
  availability?: number;
}

export function DateConfirmation({ selectedDate, availability = 0 }: DateConfirmationProps) {
  const formattedDate = format(parseISO(selectedDate), 'EEEE, MMMM d, yyyy');

  const getAvailabilityConfig = () => {
    if (availability === 0) {
      return {
        bgColor: 'bg-red-50',
        textColor: 'text-red-900',
        secondaryColor: 'text-red-700',
        borderColor: 'border-red-100',
        icon: <XCircle className="h-6 w-6 md:h-8 md:w-8 text-red-500" />,
        message: 'This date is fully booked',
        status: 'Fully Booked',
        statusBg: 'bg-red-100',
        statusText: 'text-red-700'
      };
    }
    
    if (availability < 15) {
      return {
        bgColor: 'bg-orange-50',
        textColor: 'text-orange-900',
        secondaryColor: 'text-orange-700',
        borderColor: 'border-orange-100',
        icon: <AlertTriangle className="h-6 w-6 md:h-8 md:w-8 text-orange-500" />,
        message: 'Limited availability - Book now to secure your spot!',
        status: 'Limited Availability',
        statusBg: 'bg-orange-100',
        statusText: 'text-orange-700'
      };
    }
    
    return {
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-900',
      secondaryColor: 'text-emerald-700',
      borderColor: 'border-emerald-100',
      icon: <CheckCircle className="h-6 w-6 md:h-8 md:w-8 text-emerald-500" />,
      message: 'Great choice! This date is available for booking.',
      status: 'Available',
      statusBg: 'bg-emerald-100',
      statusText: 'text-emerald-700'
    };
  };

  const config = getAvailabilityConfig();

  return (
    <div className={`${config.bgColor} rounded-lg overflow-hidden shadow-sm`}>
      <div className="p-3 md:p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex-shrink-0">
              {config.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between md:block">
                <h3 className={`text-base md:text-lg font-semibold ${config.textColor} mb-0.5`}>
                  Date Selected
                </h3>
                <div className="md:hidden">
                  <div className={`inline-flex items-center gap-1.5 ${config.statusBg} px-2.5 py-1 rounded-full`}>
                    <Calendar className={`h-4 w-4 ${config.statusText}`} />
                    <span className={`text-xs font-medium ${config.statusText}`}>
                      {config.status}
                    </span>
                  </div>
                </div>
              </div>
              <p className={`text-sm md:text-base ${config.secondaryColor}`}>
                {formattedDate}
              </p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-2">
            <div className={`${config.statusBg} px-4 py-2 rounded-full`}>
              <div className="flex items-center gap-2">
                <Calendar className={`h-5 w-5 ${config.statusText}`} />
                <span className={`text-sm font-medium ${config.statusText}`}>
                  {config.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`px-3 md:px-4 py-2 ${config.bgColor}/50 border-t ${config.borderColor}`}>
        <p className={`text-xs md:text-sm ${config.secondaryColor} text-center font-medium`}>
          {config.message}
        </p>
      </div>
    </div>
  );
}