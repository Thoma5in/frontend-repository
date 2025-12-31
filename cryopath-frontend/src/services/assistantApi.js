import axios from 'axios';

const API_URL = 'http://localhost:3004/api/chat'; // Update with your actual backend URL

/**
 * Sends a message to the AI Assistant
 * @param {string} message - The user's message
 * @param {string} userId - The ID of the user sending the message
 * @param {string} [conversationId] - Optional conversation ID for continuing a conversation
 * @param {Object} [metadata] - Optional metadata to include with the message
 * @returns {Promise<Object>} The AI's response
 */
export const sendMessage = async (message, userId, conversationId = null, metadata = {}) => {
  try {
    const payload = {
      message,
      userId,
      ...(conversationId && { conversationId }),
      ...(Object.keys(metadata).length > 0 && { metadata })
    };

    const response = await axios.post(`${API_URL}/message`, payload);
    return response.data;
  } catch (error) {
    console.error('Error sending message to AI Assistant:', error);
    throw error;
  }
};

/**
 * Fetches the conversation history for a specific conversation
 * @param {string} conversationId - The ID of the conversation to fetch
 * @returns {Promise<Array>} The conversation history
 */
export const getConversationHistory = async (conversationId) => {
  try {
    const response = await axios.get(`${API_URL}/history/${conversationId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching conversation history:', error);
    throw error;
  }
};

export default {
  sendMessage,
  getConversationHistory
};