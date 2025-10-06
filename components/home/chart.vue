<template>
    <div class="chart-container">
        <div class="chart-header">
            <h3 class="chart-title">نسبة إشغال الطاولات</h3>
            <div class="chart-legend">
                <label class="legend-item">
                    <input 
                        type="checkbox" 
                        v-model="showOccupied" 
                        @change="updateChart"
                        class="legend-checkbox"
                    />
                    <span class="legend-text">نسبة الإشغال</span>
                </label>
                <label class="legend-item">
                    <input 
                        type="checkbox" 
                        v-model="showAvailable" 
                        @change="updateChart"
                        class="legend-checkbox"
                    />
                    <span class="legend-text">المتاح</span>
                </label>
            </div>
        </div>
        <VChart ref="chart" class="custom-chart" :option="option" style="height: 240px; width: 100%; display: block" />
    </div>
</template>

<script setup>

const echarts = await import("echarts/core");
import { TooltipComponent, LegendComponent } from "echarts/components";
import { PieChart } from "echarts/charts";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([
  PieChart,
  CanvasRenderer,
  UniversalTransition,
  TooltipComponent,
  LegendComponent,
]);

const chart = ref(null);
const showOccupied = ref(false);
const showAvailable = ref(false);

const chartData = [
  { 
    value: 60, 
    name: "نسبة الإشغال",
    itemStyle: { color: "#E8E8E8" }
  },
  { 
    value: 40, 
    name: "المتاح",
    itemStyle: { color: "#666666" }
  },
];

const getChartData = () => {
  // إذا لم يتم تحديد أي checkbox، نعرض كل البيانات
  if (!showOccupied.value && !showAvailable.value) {
    return chartData;
  }
  
  const filteredData = [];
  
  if (showOccupied.value) {
    filteredData.push(chartData[0]);
  }
  
  if (showAvailable.value) {
    filteredData.push(chartData[1]);
  }
  
  return filteredData;
};

const option = ref({
  tooltip: {
    trigger: "item",
    formatter: "{b}: {c}%",
    backgroundColor: "#2A2A2A",
    borderWidth: 0,
    textStyle: { color: "#fff" },
  },
  series: [
    {
      type: "pie",
      radius: ["50%", "70%"],
      center: ["50%", "50%"],
      avoidLabelOverlap: false,
      startAngle: 90,
      label: {
        show: true,
        position: "outside",
        formatter: "{c}%",
        fontSize: 16,
        fontWeight: "bold",
        color: "#fff",
      },
      labelLine: {
        show: true,
        length: 20,
        length2: 10,
        lineStyle: {
          color: "#fff",
        },
      },
      emphasis: {
        scale: false,
        scaleSize: 0,
      },
      animationType: 'scale',
      animationEasing: 'elasticOut',
      data: getChartData(),
    },
  ],
});

const updateChart = () => {
  option.value.series[0].data = getChartData();
};

</script>

<style lang="scss" scoped>
.chart-container {
    background-color: #2A2A2A;
    border-radius: 12px;
    padding: 20px;
    border: 1px solid #3a3a3a;
}

.chart-header {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 15px;
}

.chart-title {
    color: #fff;
    font-size: 16px;
    font-weight: 600;
    margin: 0;
}

.chart-legend {
    display: flex;
    gap: 20px;
    align-items: center;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    user-select: none;
}

.legend-checkbox {
    width: 16px;
    height: 16px;
    cursor: pointer;
    accent-color: gray;
}

.legend-box {
    width: 16px;
    height: 16px;
    border-radius: 4px;
    
    &.occupied {
        background-color: #E8E8E8;
    }
    
    &.available {
        background-color: #666666;
    }
}

.legend-text {
    color: #fff;
    font-size: 14px;
}

@media (max-width: 576px) {
    .chart-header {
        flex-direction: column;
        align-items: flex-start;
    }
}
</style>
