function waitUntil(condition, { interval = 16, timeout = 0 } = {}) {
    //check if condition is function
    const isFn = typeof condition === "function"

    //get time since executed
    const start = Date.now()

    return new Promise((resolve, reject) => {
        function check() {
            //is condition yes
            const passed = isFn ? condition() : !!condition
            if (passed) {
                resolve(true)
                return
            }

            if (timeout > 0 && Date.now() - start >= timeout) {
                reject(new Error("waitUntil timed out"))
                return
            }

            setTimeout(check, interval)
        }

        check()
    })
}
