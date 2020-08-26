export default {
  data() {
    return {
      latestCopiedHash: null,
    };
  },
  methods: {
    isHashCopied(hash) {
      return this.latestCopiedHash === hash;
    },
    copyToClipboard(key) {
      const selection = window.getSelection();
      const range = window.document.createRange();
      selection.removeAllRanges();
      range.selectNode(this.$refs[key]);
      selection.addRange(range);

      try {
        this.latestCopiedHash = key;
        this.$notify({
          type: 'success',
          title: 'Oasis Monitor',
          text: 'Hash copied to clipboard',
        });

        document.execCommand('copy');
      } catch (err) {
        selection.removeAllRanges();
      }
    },
  },
};
