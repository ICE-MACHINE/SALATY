async function fetchSalatDataToday(lat: number, lng: number): Promise<{todayTimings:any,todayDate:any} | null> {
    try {
        const response = await fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=19`);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        if(data.code !== 200)
             throw new Error("Error fetching salat data");
        return {
            todayTimings: data.data.timings,
            todayDate: data.data.date
        }
    } catch (error) {
        console.error("Error fetching salat data:", error);
        return null;
    }
}

export default fetchSalatDataToday;