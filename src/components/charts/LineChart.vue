<script>
import { Line, mixins } from 'vue-chartjs';

const { reactiveProp } = mixins;

export default {
  extends: Line,
  mixins: [reactiveProp],
  props: {
    customTooltip: {
      type: Function,
      default() {
        return null;
      },
    },
    yTicksStepSize: {
      type: Number,
      default: 0,
    },
    yAxesType: {
      type: String,
      default: 'linear',
    },
    yAxesBeginAtZero: {
      type: Boolean,
      default: true,
    },
    yAxesMaxTicksLimit: {
      type: Number,
      default: 0,
    },
    xAxesMaxTicksLimit: {
      type: Number,
      default: 0,
    },
    yTicksCallback: {
      type: Function,
      default(label) {
        if (label > 999999) {
          return `${label / 1000 / 1000}M`;
        }
        if (label > 999) {
          return `${label / 1000}K`;
        }

        return label;
      },
    },
    tooltipsLabelCallback: {
      type: Function,
      default(tooltipItem, data) {
        return `${data.datasets[0].label}: ${tooltipItem.value}`;
      },
    },
    options: {
      type: Object,
      default() {
        return {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            labels: {
              fontFamily: 'Nunito',
              fontColor: '#2d2e2c',
            },
          },
          scales: {
            yAxes: [
              {
                type: 'linear',
                display: true,
                gridLines: {
                  drawOnChartArea: true,
                  color: 'rgba(33, 37, 41, 0.1)',
                },
                ticks: {
                  maxTicksLimit: this.yAxesMaxTicksLimit,
                  fontFamily: 'Nunito',
                  fontColor: '#2d2e2c',
                  beginAtZero: this.yAxesBeginAtZero,
                  stepSize: this.yTicksStepSize,
                  callback: this.yTicksCallback,
                },
              },
            ],
            xAxes: [
              {
                gridLines: {
                  drawOnChartArea: false,
                },
                ticks: {
                  maxTicksLimit: this.xAxesMaxTicksLimit,
                  fontColor: '#2d2e2c',
                  fontFamily: 'Nunito',
                },
              },
            ],
          },
          tooltips: {
            enabled: Boolean(this.customTooltip),
            titleFontFamily: 'Nunito',
            bodyFontFamily: 'Nunito',
            displayColors: false,
            backgroundColor: 'rgba(33, 37, 41, 0.8)',
            bodyAlign: 'center',
            titleAlign: 'center',
            cornerRadius: 4,
            callbacks: {
              label: this.tooltipsLabelCallback,
            },
          },
          elements: {
            line: {
              borderColor: 'rgba(76, 212, 169, .6)',
              borderWidth: 2,
              fill: true,
              backgroundColor: 'rgba(76, 212, 169, 0.15)',
              cubicInterpolationMode: 'monotone',
            },
            point: {
              borderColor: 'rgb(76, 212, 169)',
              backgroundColor: 'rgb(76, 212, 169)',
              radius: 2,
              hitRadius: 6,
              hoverRadius: 4,
              hoverBorderWidth: 2,
            },
          },
        };
      },
    },
  },
  mounted() {
    // this.chartData is created in the mixin.
    // If you want to pass options please create a local options object
    this.renderChart(this.chartData, this.options);
  },
};
</script>
