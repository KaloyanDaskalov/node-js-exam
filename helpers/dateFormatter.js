module.exports = (data = []) => {
    data.forEach(x => (
        x.createdAt = new Date(x.createdAt)
            .toLocaleDateString('en-EN', { weekday: 'short', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })));
    return data;
}