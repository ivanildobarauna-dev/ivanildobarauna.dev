"""Logging module for the application."""

import logging
import os
import sys
from logging.handlers import RotatingFileHandler
from typing import Optional


class Logger:
    """Logger class for the application."""

    _instance: Optional["Logger"] = None
    _logger: Optional[logging.Logger] = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(Logger, cls).__new__(cls)
            cls._logger = cls._configure_logger()
        return cls._instance

    @staticmethod
    def _configure_logger() -> logging.Logger:
        """Configure the logger."""
        log_format = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        log_level = os.environ.get("LOG_LEVEL", "INFO")
        
        # Create logger
        logger = logging.getLogger("portfolio_api")
        logger.setLevel(getattr(logging, log_level))
        logger.propagate = False
        
        # Clear existing handlers
        if logger.handlers:
            logger.handlers.clear()
        
        # Console handler
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setFormatter(logging.Formatter(log_format))
        logger.addHandler(console_handler)
        
        # File handler with rotation
        log_dir = os.path.join(os.getcwd(), "logs")
        os.makedirs(log_dir, exist_ok=True)
        file_handler = RotatingFileHandler(
            os.path.join(log_dir, "portfolio_api.log"),
            maxBytes=10485760,  # 10MB
            backupCount=5,
        )
        file_handler.setFormatter(logging.Formatter(log_format))
        logger.addHandler(file_handler)
        
        return logger

    @classmethod
    def debug(cls, message: str) -> None:
        """Log debug message."""
        if cls._logger is None:
            cls._logger = cls._configure_logger()
        cls._logger.debug(message)

    @classmethod
    def info(cls, message: str) -> None:
        """Log info message."""
        if cls._logger is None:
            cls._logger = cls._configure_logger()
        cls._logger.info(message)

    @classmethod
    def warning(cls, message: str) -> None:
        """Log warning message."""
        if cls._logger is None:
            cls._logger = cls._configure_logger()
        cls._logger.warning(message)

    @classmethod
    def error(cls, message: str) -> None:
        """Log error message."""
        if cls._logger is None:
            cls._logger = cls._configure_logger()
        cls._logger.error(message)

    @classmethod
    def critical(cls, message: str) -> None:
        """Log critical message."""
        if cls._logger is None:
            cls._logger = cls._configure_logger()
        cls._logger.critical(message)


# Create logger instance
logger = Logger()
