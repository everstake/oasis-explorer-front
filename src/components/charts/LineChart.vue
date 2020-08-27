<script>
import { Line, mixins } from 'vue-chartjs';
import numeral from 'numeral';

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
        if (label === 0) {
          return 0;
        }

        if (label > 999999) {
          return `${label / 1000 / 1000}M`;
        }
        if (label > 999) {
          return `${label / 1000}K`;
        }

        return label.toFixed(5);
      },
    },
    tooltipsLabelCallback: {
      type: Function,
      // eslint-disable-next-line consistent-return
      default(t, d) {
        const xLabel = d.datasets[t.datasetIndex].label;
        const { yLabel } = t;

        for (let i = 0; i <= 10; i += 1) {
          if (t.datasetIndex === i) {
            return `${xLabel}: ${numeral(yLabel / 1000000000).format(
              '0,0.[000000000]',
            )}`;
          }
        }
      },
    },
  },
  methods: {
    handleChartClick(point, event) {
      /* eslint-disable */
      const item = event[0];
      this.$emit('on-receive', {
        index: item._index,
        backgroundColor: item._view.backgroundColor,
        value: this.values[item._index],
      });
    },
  },
  mounted() {
    const defaultOptions = {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        fullWidth: false,
        position: 'bottom',
        labels: {
          fontFamily: 'Nunito',
          fontColor: '#2d2e2c',
        },
      },
      scales: {
        yAxes: [
          {
            type: this.yAxesType,
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
        mode: 'x-axis',
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
          borderColor: 'rgba(76, 212, 169, 1)',
          borderWidth: 1,
          fill: true,
          backgroundColor: 'rgba(76, 212, 169, 0.6)',
          cubicInterpolationMode: 'monotone',
        },
        point: {
          borderColor: 'rgba(76, 212, 169, 1)',
          backgroundColor: '#fff',
          borderWidth: 1,
        },
      },
    };
    // this.chartData is created in the mixin.
    // If you want to pass options please create a local options object
    this.renderChart(this.chartData, defaultOptions);
  },
};
</script>
