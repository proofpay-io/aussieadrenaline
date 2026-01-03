/**
 * Logger helper to safely use Pino logger
 * Prevents "Cannot read properties of undefined (reading 'Symbol(pino.msgPrefix)')" errors
 */

/**
 * Safely log info message
 * Prevents Pino logger errors by checking logger validity before use
 */
export function safeLogInfo(logger, message, data = {}) {
  // Always fallback to console if logger is invalid
  if (!logger || typeof logger !== 'object') {
    console.log(message, data);
    return;
  }
  
  // Check if logger has info method and it's a function
  if (typeof logger.info === 'function') {
    try {
      logger.info(message, data);
    } catch (e) {
      // If logger fails, use console
      console.log(message, data);
    }
  } else {
    console.log(message, data);
  }
}

/**
 * Safely log warn message
 * Prevents Pino logger errors by checking logger validity before use
 */
export function safeLogWarn(logger, message, data = {}) {
  // Always fallback to console if logger is invalid
  if (!logger || typeof logger !== 'object') {
    console.warn(message, data);
    return;
  }
  
  // Check if logger has warn method and it's a function
  if (typeof logger.warn === 'function') {
    try {
      logger.warn(message, data);
    } catch (e) {
      // If logger fails, use console
      console.warn(message, data);
    }
  } else {
    console.warn(message, data);
  }
}

/**
 * Safely log error message
 * Prevents Pino logger errors by checking logger validity before use
 */
export function safeLogError(logger, message, data = {}) {
  // Always fallback to console if logger is invalid
  if (!logger || typeof logger !== 'object') {
    console.error(message, data);
    return;
  }
  
  // Check if logger has error method and it's a function
  if (typeof logger.error === 'function') {
    try {
      logger.error(message, data);
    } catch (e) {
      // If logger fails, use console
      console.error(message, data);
    }
  } else {
    console.error(message, data);
  }
}

