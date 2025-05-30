import React from 'react';
import { 
  FiMail, 
  FiPhone, 
  FiCalendar, 
  FiCheckCircle, 
  FiUsers, 
  FiClock, 
  FiFileText, 
  FiMessageCircle 
} from 'react-icons/fi';

interface EventIconProps {
  type: 'email' | 'phone' | 'calendar' | 'assessment' | 'interview' | 'system' | 'message' | 'note' | 'document';
  channel?: string;
}

const EventIcon: React.FC<EventIconProps> = ({ type, channel }) => {
  // Special case for WhatsApp
  if (channel === 'WhatsApp') {
    return (
      <div className="flex items-center justify-center">
        <svg viewBox="0 0 32 32" width="14" height="14" fill="#25D366">
          <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1 .09-.362c.124-.124.286-.217.46-.217.091 0 .181.03.253.09.344.218.605.546.83.88.058.09.091.181.091.271 0 .152-.148.28-.342.374-.174.095-.301.217-.301.33 0 .152.148.343.342.437.193.095.495.192.786.29.29.09.428.182.428.343 0 .152-.138.437-.342.532-.193.095-.343.152-.343.343 0 .19.428.343.856.532.43.19.675.532.675.722 0 .152-.183.343-.498.343zm3.35-3.219c-.13-.724-.502-1.391-.873-1.93-.347-.544-.826-1.04-1.26-1.436-.435-.395-.904-.724-1.304-.873a3.979 3.979 0 0 0-1.218-.219c-.29 0-.524.09-.698.18-.262.152-.305.38-.305.533 0 .152.043.381.305.533.26.152.52.185.739.185.217 0 .351-.09.351-.254 0-.152-.09-.203-.09-.336a.923.923 0 0 1 .288-.704c.175-.168.415-.237.679-.237h.057c.262 0 .524.04.785.164.262.124.393.33.481.517.255.532.213 1.189.213 1.742 0 .276.224.552.498.552a.45.45 0 0 0 .32-.123c.175-.168.262-.446.262-.774 0-.11-.012-.22-.036-.33zm2.005 8.835c-.794.448-1.762.69-2.638.756-.824.064-1.648.026-2.44-.1a9.686 9.686 0 0 1-2.127-.655c-.617-.27-1.19-.577-1.715-.94a17.245 17.245 0 0 1-1.489-1.116 12.28 12.28 0 0 1-1.262-1.202 10.203 10.203 0 0 1-.728-.872c-.092-.123-.184-.257-.276-.38l-.044-.06a16.09 16.09 0 0 1-1.04-1.61 7.84 7.84 0 0 1-.584-1.356 6.294 6.294 0 0 1-.305-1.222 5.443 5.443 0 0 1-.027-1.193c.027-.335.092-.67.184-.994.163-.548.426-1.06.775-1.517.268-.354.565-.664.886-.939a3.3 3.3 0 0 1 1.066-.583c.331-.109.678-.157 1.015-.157.184 0 .357.012.519.035.335.047.648.158.927.326.251.157.473.353.647.574l.148.192c.05.062.091.124.134.186.058.083.115.165.173.246.195.27.375.551.529.842.195.354.337.728.423 1.113.075.329.108.67.108 1.01 0 .35-.034.692-.108 1.021-.092.394-.23.767-.426 1.113a4.682 4.682 0 0 1-.539.842l-.049.064a2.225 2.225 0 0 0-.404.777c0 .132.065.253.183.33a36.326 36.326 0 0 0 5.197 2.86 1.39 1.39 0 0 0 .375.116.896.896 0 0 0 .4-.064c.402-.174.736-.47.997-.844.184-.268.341-.559.47-.861.093-.218.166-.448.22-.68a4.93 4.93 0 0 1 .155-.516l.146-.426c.063-.166.14-.32.234-.458.093-.138.21-.25.341-.334a1.42 1.42 0 0 1 .812-.224c.332 0 .65.053.95.157.351.12.666.277.95.493.331.251.633.529.904.842.271.314.52.65.746.999.224.35.412.721.562 1.11.076.218.124.447.146.685.023.208.023.417 0 .626a2.526 2.526 0 0 1-.197.656c-.087.19-.21.361-.33.511a3.798 3.798 0 0 1-.543.584c-.372.329-.798.599-1.256.809zM16.017 0C7.197 0 .047 7.094.047 15.845c0 2.897.777 5.713 2.254 8.181l-2.288 8.43a.467.467 0 0 0 .114.436.455.455 0 0 0 .322.157.484.484 0 0 0 .153-.025l8.61-2.2c2.351 1.33 5.03 2.03 7.769 2.03 8.82 0 15.97-7.093 15.97-15.844S24.837 0 16.017 0z" />
        </svg>
      </div>
    );
  }

  // Special case for LinkedIn
  if (channel === 'LinkedIn') {
    return (
      <div className="flex items-center justify-center">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="#0077B5">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      </div>
    );
  }

  const iconSize = "h-3.5 w-3.5 text-gray-600";

  switch (type) {
    case 'email': 
      return <FiMail className={iconSize} />;
    case 'phone': 
      return <FiPhone className={iconSize} />;
    case 'calendar': 
      return <FiCalendar className={iconSize} />;
    case 'assessment': 
      return <FiCheckCircle className={iconSize} />;
    case 'interview': 
      return <FiUsers className={iconSize} />;
    case 'system': 
      return <FiClock className={iconSize} />;
    case 'message': 
      return <FiMessageCircle className={iconSize} />;
    case 'note': 
      return <FiFileText className={iconSize} />;
    case 'document':
      return <FiFileText className={iconSize} />;
    default: 
      return <FiClock className={iconSize} />;
  }
};

export default EventIcon; 