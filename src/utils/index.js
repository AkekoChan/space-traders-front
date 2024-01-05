export function formatFirstLetterToUpperCase(word) {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export function formatDateToEuropean(dateStr) {
  const date = new Date(dateStr);

  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

  const formattedDate = new Intl.DateTimeFormat("fr-FR", options).format(date);
  return formattedDate;
}

export function getFormattedTimeFromTimestamp(timestamp) {
  const date = new Date(timestamp);
  const options = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // Utilise le format 24 heures
  };

  const formattedTime = new Intl.DateTimeFormat("en-US", options).format(date);
  return formattedTime;
}

export function replaceUnderscoreWithSpace(text) {
  const newText = text.replace(/_/g, " ");

  return newText;
}

export function distance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

export function travelTime(dist, multiplier, engineSpeed) {
  return Math.round(
    Math.round(Math.max(1, dist)) * (multiplier / engineSpeed) + 15
  );
}

export function fetchData(options) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(
        `https://api.spacetraders.io/v2/${options.endpoint}`,
        {
          method: options.method || "GET",
          headers: options.headers || {},
          body: options.body || null,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error Response:", errorData);
        reject(new Error(`Request failed with status: ${response.status}`));
        return;
      }

      const responseData = await response.json();
      resolve(responseData.data);
    } catch (error) {
      console.error("Fetch Error:", error);
      reject(error);
    }
  });
}
