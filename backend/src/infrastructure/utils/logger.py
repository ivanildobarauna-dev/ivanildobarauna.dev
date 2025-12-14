"""Logging module for the application."""

import logging
import os
import sys
from logging.handlers import RotatingFileHandler
from typing import Optional


def _configure_handler(handler: logging.Handler) -> None:
    """Configure a handler with the custom formatter."""
    formatter = logging.Formatter(
        '%(levelname)s - %(name)s - %(message)s'
    )
    handler.setFormatter(formatter)


def _setup_logger(name: str) -> logging.Logger:
    """Create and configure a logger with the given name."""
    logger = logging.getLogger(name)
    logger.setLevel(os.environ.get("LOG_LEVEL", "INFO"))
    
    # Avoid adding handlers multiple times in case of module reload
    if not logger.handlers:
        # Console handler
        console_handler = logging.StreamHandler(sys.stdout)
        _configure_handler(console_handler)
        logger.addHandler(console_handler)
        
        # File handler with rotation
        log_dir = os.path.join(os.getcwd(), "logs")
        os.makedirs(log_dir, exist_ok=True)
        file_handler = RotatingFileHandler(
            os.path.join(log_dir, "portfolio_api.log"),
            maxBytes=10 * 1024 * 1024,  # 10MB
            backupCount=5,
            encoding='utf-8'
        )
        _configure_handler(file_handler)
        logger.addHandler(file_handler)
    
    return logger


def get_logger(name: str) -> logging.Logger:
    """Get a logger instance with the given name.
    
    Args:
        name: The name of the logger, typically __name__
        
    Returns:
        A configured logger instance
    """
    return _setup_logger(name)
