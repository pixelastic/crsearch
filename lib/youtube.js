import { firostError, readJsonUrl } from 'firost';
import { _ } from 'golgoth';
import config from './config.js';

/**
 * Converts an ISO 8601 duration (e.g., PT1H2M30S, PT5M20S, PT45S) to M:SS or H:MM:SS format.
 *
 * @function formatDuration
 * @param {string} isoDuration - The ISO 8601 duration string (e.g., PT1H2M30S, PT5M20S, PT45S)
 * @returns {string} The formatted duration (e.g., "1:02:30", "5:20", "0:45")
 *
 * @example
 * formatDuration('PT1H2M30S') // returns "1:02:30"
 * formatDuration('PT5M20S')   // returns "5:20"
 * formatDuration('PT45S')     // returns "0:45"
 */
export function formatDuration(isoDuration) {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  const hours = parseInt(match[1] || 0);
  const minutes = parseInt(match[2] || 0);
  const seconds = parseInt(match[3] || 0);

  if (hours > 0) {
    return `${hours}:${_.padStart(minutes, 2, '0')}:${_.padStart(seconds, 2, '0')}`;
  }
  return `${minutes}:${_.padStart(seconds, 2, '0')}`;
}

/**
 * Retrieves the view count for a YouTube video using the YouTube Data API v3.
 *
 * @async
 * @function getViewCount
 * @param {string} videoId - The YouTube video ID to get the view count for
 * @returns {Promise<number>} The view count as an integer
 * @throws {firostError} Throws 'YOUTUBE_MISSING_KEY' error if YouTube API key is not configured
 * @throws {firostError} Throws 'YOUTUBE_MISSING_VIDEO' error if the video cannot be found
 */
export async function getViewCount(videoId) {
  const apiKey = config.youtube.apiKey;
  if (!apiKey) {
    throw new firostError(
      'YOUTUBE_MISSING_KEY',
      'YOUTUBE_API_KEY env variable is required',
    );
  }

  const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${apiKey}`;

  const response = await readJsonUrl(apiUrl);
  const items = response.items;

  if (!items) {
    throw new firostError(
      'YOUTUBE_MISSING_VIDEO',
      `Unable to find video ${videoId}`,
    );
  }

  const statistics = response.items[0].statistics;

  return _.parseInt(statistics.viewCount);
}
