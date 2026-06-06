self.addEventListener('push', function(event) {
    // Check if the event has data
    if (event.data) {
        try {
            const data = event.data.json();
            self.registration.showNotification(data.title, {
                body: data.body,
                icon: 'https://cdn-icons-png.flaticon.com/512/3119/3119338.png',
                vibrate: [100, 50, 100]
            });
        } catch (e) {
            // Fallback if the data is plain text instead of JSON
            self.registration.showNotification('Secretary App', {
                body: event.data.text()
            });
        }
    }
});