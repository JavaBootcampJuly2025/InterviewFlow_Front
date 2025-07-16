import React from 'react';
import PropTypes from 'prop-types';
import './Button.css';

export default function Button({
                                   children,
                                   onClick,
                                   type = 'button',
                                   disabled = false,
                                   variant = 'primary',  // variant prop to switch styles
                                   className = '',
                               }) {
    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={`my-button ${variant} ${className}`}
        >
            {children}
        </button>
    );
}

Button.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
    type: PropTypes.string,
    disabled: PropTypes.bool,
    variant: PropTypes.oneOf(['primary', 'edit']),
    className: PropTypes.string,
};
