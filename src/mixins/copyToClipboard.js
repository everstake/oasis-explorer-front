export default {
  data() {
    return {
      isHashCopied: false,
    };
  },
  methods: {
    copyToClipboard(key) {
      const selection = window.getSelection();
      const range = window.document.createRange();
      selection.removeAllRanges();
      range.selectNode(this.$refs[key]);
      selection.addRange(range);

      try {
        this.isHashCopied = true;
        this.$notify({
          type: 'success',
          title: 'Oasis Explorer',
          text: 'Hash copied to clipboard',
        });

        document.execCommand('copy');

        setTimeout(() => {
          selection.removeAllRanges();
          this.isHashCopied = false;
        }, 1000);
      } catch (err) {
        selection.removeAllRanges();
        this.isHashCopied = false;
      }
    },
  },
};
