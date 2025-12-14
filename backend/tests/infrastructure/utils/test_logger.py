"""Tests for the logger module."""

from unittest.mock import patch

from src.infrastructure.utils.logger import get_logger

logger = get_logger(__name__)


@patch("logging.Logger.debug")
def test_logger_debug(mock_debug):
    """Test that logger debug calls logging.Logger.debug."""
    logger.debug("test message")
    mock_debug.assert_called_once_with("test message")


@patch("logging.Logger.info")
def test_logger_info(mock_info):
    """Test that logger info calls logging.Logger.info."""
    logger.info("test message")
    mock_info.assert_called_once_with("test message")


@patch("logging.Logger.warning")
def test_logger_warning(mock_warning):
    """Test that logger warning calls logging.Logger.warning."""
    logger.warning("test message")
    mock_warning.assert_called_once_with("test message")


@patch("logging.Logger.error")
def test_logger_error(mock_error):
    """Test that logger error calls logging.Logger.error."""
    logger.error("test message")
    mock_error.assert_called_once_with("test message")


@patch("logging.Logger.critical")
def test_logger_critical(mock_critical):
    """Test that logger critical calls logging.Logger.critical."""
    logger.critical("test message")
    mock_critical.assert_called_once_with("test message")
