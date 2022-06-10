const utils = {}

utils.FormatTime = (timestamp) => {
    let formats = 'Y-m-d H:i:s'
    const addzero = function(val) {
        if (val < 10) {
            return '0' + val
        }
        return val
    }

    const formatDate = new Date(timestamp)
    const year = formatDate.getFullYear()
    const month = addzero(formatDate.getMonth() + 1)
    const day = addzero(formatDate.getDate())
    const hour = addzero(formatDate.getHours())
    const minute = addzero(formatDate.getMinutes())
    const second = addzero(formatDate.getMinutes())

    //match是前面正则匹配到的每个字符
    return formats.replace(/Y|m|d|H|i|s/ig, function(match) {
        // 将匹配到的字符换成对应的值
        return ({
            Y: year,
            m: month,
            d: day,
            H: hour,
            i: minute,
            s: second
        })[match]
    })
}


//压缩图片
utils.compressFile = (pic) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            //dataurl会比本身大1/3
            const img = new Image();
            const quality = 0.92;

            img.src = this.result;
            // console.log(this);
            img.onload = async() => {
                // 创建画布
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
                const canvasUrl = canvas.toDataURL("image/jpeg", quality);

                const arr = canvasUrl.split(",");
                const mime = arr[0].match(/:(.*)?;/);
                const buffer = atob(arr[1]);
                let n = buffer.length;
                const bufferArr = new Uint8Array(n);
                while (n--) {
                    bufferArr[n] = buffer.charCodeAt(n);
                }
                const compressFile = new Blob([bufferArr]);
                canvas.remove();
                resolve({
                    file: compressFile,
                    origin: pic,
                    canvasDataUrl: canvasUrl,
                    beforeKb: Number((pic.size / 1024).toFixed(2)),
                    afterKb: Number((compressFile.size / 1024).toFixed(2)),
                });
            };
        };
        reader.readAsDataURL(pic);
    });
}


export default utils