console.log('%c[YTthumbnail] %cScript loaded', 'color: red;', 'color: blue');

// Helper function to delay execution
function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// Add a flag to track if the thumbnail and title have already been added
let thumbnailAdded = false;

// Function to insert the thumbnail container
async function addThumbnailContainer() {
    // Check if the thumbnail container has already been added
    if (thumbnailAdded) {
        console.log('%c[YTthumbnail] %cThumbnail already added, skipping...', 'color: red;', 'color: yellow');
        return;
    }

    // Wait for the #secondary div to appear in the DOM
    let secondaryDiv = null;
    let maxIterations = 60;
    while (!secondaryDiv) {
        console.log('%c[YTthumbnail] %cWaiting for secondary div...', 'color: red;', 'color: orange');
        secondaryDiv = document.querySelector("#secondary");
        if (maxIterations <= 0) {
            return;
        }
        maxIterations--;
        await wait(500); // Check every 500ms
    }

    // Check if the thumbnail container has already been added
    if (thumbnailAdded) {
        console.log('%c[YTthumbnail] %cThumbnail already added, skipping...', 'color: red;', 'color: yellow');
        return;
    }

    // Set the flag to true to prevent multiple additions
    thumbnailAdded = true;

    // Once #secondary is found, wait a bit longer to ensure full load
    console.log('%c[YTthumbnail] %cSecondary div found, waiting to ensure full page load...', 'color: red;', 'color: green');
    await wait(2000); // Wait 2 seconds after #secondary is found

    // Create a container for our extension's content
    console.log('%c[YTthumbnail] %cAdding thumbnail and title...', 'color: red;', 'color: blue');
    const extensionContainer = document.createElement("div");
    extensionContainer.id = "thumbnail-extension-container";

    // Fetch the thumbnail URL
    const videoId = new URLSearchParams(window.location.search).get("v");
    let thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    try {
        const response = await fetch(thumbnailUrl);
        if (!response.ok) {
            thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`; // Fallback
        }
    } catch (error) {
        thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`; // Fallback in case of error
    }

    // Add the thumbnail to the container
    const thumbnailImage = document.createElement("img");
    thumbnailImage.src = thumbnailUrl;
    thumbnailImage.alt = "Video Thumbnail";
    thumbnailImage.style.display = "block";

    // Add the title container
    const titleElement = document.createElement("div");
    titleElement.id = "thumbnail-title";
    titleElement.textContent = "Loading..."; // Placeholder

    extensionContainer.appendChild(thumbnailImage);
    extensionContainer.appendChild(titleElement);

    // Insert the container into the YouTube page
    secondaryDiv.insertBefore(extensionContainer, secondaryDiv.firstChild);

    // Fetch and update the video title
    const videoTitle = document.title.replace(" - YouTube", "");
    titleElement.textContent = videoTitle;
    console.log('%c[YTthumbnail] %cThumbnail and title added successfully!', 'color: red;', 'color: green');
}

// Start observing DOM changes to detect YouTube's dynamic loading
const observer = new MutationObserver(() => {
    if (!thumbnailAdded) {
        addThumbnailContainer();
    }
});

// Start observing the body for changes
observer.observe(document.body, { childList: true, subtree: true });

// Run the function initially in case the element is already present
addThumbnailContainer();
