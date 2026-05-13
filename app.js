// app.js - 終極整合版

// 1. 準備數據
const timeLabels = ['07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00'];

const ritalin20 = [1, 3, 5, 5.3, 4.5, 4, 3.2, 3.5, 4.5, 5.9, 6.2, 6, 5, 4, 3.2, 2.5, 2, 1.7, 1.4, 1.5, 1.2, 1, 0.9, 0.8];
const ritalin40 = [2, 6, 10, 10.6, 9, 8, 6.4, 7, 9, 11.8, 12.4, 12, 10, 8, 6.4, 5, 4, 3.4, 2.8, 3, 2.4, 2, 1.8, 1.6];
const ritalin20Bid4hr = [1, 3, 5, 5.3, 4.5, 4, 3.2, 3.5, 5.5, 8.9, 11.2, 11.3, 9.5, 8, 6.4, 6, 6.5, 7.6, 7.6, 7.5, 6.2, 5, 4.1, 3.3];
const concerta18 = [0.27, 0.54, 0.82, 1.09, 1.36, 1.63, 1.9, 2.18, 2.45, 2.72, 2.98, 3.24, 3.5, 3.32, 3.15, 2.99, 2.83, 2.68, 2.54, 2.4, 2.27, 2.14, 2.02, 1.9];
const concerta36 = [0.54, 1.09, 1.63, 2.18, 2.72, 3.27, 3.81, 4.36, 4.91, 5.45, 6, 6.54, 7.09, 6.73, 6.39, 6.05, 5.73, 5.42, 5.13, 4.85, 4.58, 4.32, 4.08, 3.84];
const methydur22 = [0.85, 1.06, 1.60, 2.13, 2.66, 3.19, 3.73, 4.26, 4.03, 3.81, 3.61, 3.41, 3.23, 3.06, 2.89, 2.74, 2.59, 2.45, 2.33, 2.21, 2.1, 1.99, 1.89, 1.79];
const methydur33 = [1.04, 2.08, 3.12, 4.16, 5.2, 6.24, 7.28, 8.32, 9.36, 10.4, 9.48, 8.64, 7.88, 7.18, 6.54, 5.96, 5.43, 4.94, 4.49, 4.07, 3.69, 3.35, 3.03, 2.75];
const comboLA20C18 = [1.27, 3.54, 5.82, 6.39, 5.86, 5.63, 5.1, 5.68, 6.95, 8.62, 9.18, 9.24, 8.5, 7.32, 6.35, 5.49, 4.83, 4.38, 3.94, 3.9, 3.47, 3.14, 2.92, 2.7];

// app.js (替換「2. 初始化圖表」的區塊)

const ctx = document.getElementById('medicationChart').getContext('2d');

// ✨ 新增：自製一個「白底小幫手」
const whiteBackgroundPlugin = {
    id: 'whiteBackground',
    beforeDraw: (chart) => {
        const context = chart.ctx;
        context.save();
        context.globalCompositeOperation = 'destination-over'; // 畫在所有東西的背後
        context.fillStyle = '#ffffff'; // 純白色
        context.fillRect(0, 0, chart.width, chart.height); // 填滿整張畫布
        context.restore();
    }
};

const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: timeLabels,
        datasets: [
            { label: 'Ritalin LA 20mg', data: ritalin20, borderColor: '#ff6384', tension: 0.4, hidden: true },
            { label: 'Ritalin LA 40mg', data: ritalin40, borderColor: '#ff9f40', tension: 0.4, hidden: true },
            { label: 'Ritalin LA 20mg BID', data: ritalin20Bid4hr, borderColor: '#ffcd56', tension: 0.4, hidden: true },
            { label: 'Concerta 18mg', data: concerta18, borderColor: '#4bc0c0', tension: 0.4, hidden: true },
            { label: 'Concerta 36mg', data: concerta36, borderColor: '#36a2eb', tension: 0.4, hidden: true },
            { label: 'Methydur 22mg', data: methydur22, borderColor: '#9966ff', tension: 0.4, hidden: true },
            { label: 'Methydur 33mg', data: methydur33, borderColor: '#c9cbcf', tension: 0.4, hidden: true },
            { label: 'LA20 + C18 組合', data: comboLA20C18, borderColor: '#8bc34a', tension: 0.4, hidden: true }
        ]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return ` ${context.dataset.label}：${context.raw} ng/mL`;
                    }
                }
            }
        }
    },
    // ✨ 新增：把小幫手聘僱進來！
    plugins: [whiteBackgroundPlugin] 
});

// 3. 按鈕切換邏輯
document.querySelectorAll('.med-btn').forEach(button => {
    button.addEventListener('click', function() {
        const index = this.getAttribute('data-index');
        myChart.data.datasets[index].hidden = !myChart.data.datasets[index].hidden;
        this.classList.toggle('active');
        myChart.update();
    });
});

// 4. 時間連動邏輯
const timeInput = document.getElementById('startTime');
function generateTimeLabels(startTimeStr) {
    let labels = [];
    let [hours, minutes] = startTimeStr.split(':').map(Number);
    for (let i = 0; i < 24; i++) {
        let h = String(hours).padStart(2, '0');
        let m = String(minutes).padStart(2, '0');
        labels.push(`${h}:${m}`);
        minutes += 30;
        if (minutes >= 60) { minutes -= 60; hours += 1; }
        if (hours >= 24) hours -= 24;
    }
    return labels;
}

if(timeInput) {
    timeInput.addEventListener('change', function() {
        myChart.data.labels = generateTimeLabels(this.value);
        myChart.update();
    });
}

// 5. 下載功能 (解決標籤不見的更新版)
const downloadBtn = document.getElementById('downloadBtn');
if(downloadBtn) {
    downloadBtn.addEventListener('click', function() {
        
        // 1. 打開內建標籤
        myChart.options.plugins.legend.display = true;
        myChart.update('none'); 

        // ✨ 2. 新增倒數計時器 (setTimeout)，等待 150 毫秒 (0.15秒) 讓瀏覽器把標籤畫好
        setTimeout(function() {
            
            // 3. 拍照！
            const canvas = document.getElementById('medicationChart');
            const link = document.createElement('a');
            link.download = '藥物濃度圖表.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
            
            // 4. 拍完照，把內建標籤關掉，恢復乾淨的網頁介面
            myChart.options.plugins.legend.display = false;
            myChart.update('none');

        }, 150); // 150 毫秒後執行這區塊的程式
    });
}