
import './ErrorHandler.scss';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Icons from '@fortawesome/free-solid-svg-icons';

library.add(Icons.faExclamationTriangle);

interface Props {
  msg?: string;
}

const ErrorHandler: React.FC<Props> = ({ msg }) => {

  return (
    <div data-testid="error" className="error-container row d-flex justify-content-center">
      <div>
        <FontAwesomeIcon icon="exclamation-triangle" size="1x" className="error-icon" />
      </div>
      <div>
        <h6>
          {msg != null ? msg : "There's been an error"}
        </h6>
      </div>
    </div>
  );
}

export default ErrorHandler;