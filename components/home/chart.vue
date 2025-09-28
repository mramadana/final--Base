<template>
    <div class="container">
        <VChart ref="chart" class="custom-chart" :option="option" style="height: 350px; width: 100%; display: block" />
    </div>
</template>

<script setup>

const echarts = await import("echarts/core");
import { GridComponent, TooltipComponent } from "echarts/components";
import { LineChart } from "echarts/charts";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([
  GridComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
  TooltipComponent,
]);

const chart = ref(null);

const option = ref({
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: ["12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22"],
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: { color: "#666" },
  },
  yAxis: {
    type: "value",
    splitLine: { lineStyle: { color: "#eee" } },
    axisLine: { show: false },
    axisTick: { show: false },
    axisLabel: {
      color: "#666",
      formatter: function (value) {
        return value + "k";
      },
    },
  },
  series: [
    {
      data: [40000, 80000, 90000, 85000, 30000, 40000, 80000, 100000, 75000, 55000, 95000],
      type: "line",
      smooth: true,
      symbol: "circle",
      symbolSize: 8,
      itemStyle: { color: "#FF4B81", opacity: 0 },
      lineStyle: { color: "#FF4B81", width: 3 },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "rgba(255, 75, 129, 0.3)" },
          { offset: 1, color: "rgba(255, 75, 129, 0.05)" },
        ]),
      },
    },
  ],
  tooltip: {
    trigger: "axis",
    axisPointer: { type: "line" },
    confine: true,
    className: "echarts-tooltip",
    formatter: "{c0} دينار",
    backgroundColor: "#FF4B81",
    borderWidth: 0,
    textStyle: { color: "#fff" },
  },
});

</script>
