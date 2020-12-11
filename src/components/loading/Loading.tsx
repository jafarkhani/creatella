import React from 'react';
import './loading.scss';

interface Props{
    message ?: string;
}

const Loading: React.FC<Props> = ({message}) => {

        return (
            <div data-testid="loading" className="loading">
                <span className="loading-icon" ></span>
                <span className="loading-text">{ message == null ? "loading..." : message }</span>
            </div>
        );
}

export default Loading;