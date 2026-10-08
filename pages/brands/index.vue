<script>
// Old list URL: keep it working by forwarding to the home page (query is preserved)
export default {
  name: 'BrandsRedirectPage',
  middleware({ redirect, query }) {
    redirect(301, '/', query)
  },
  render: (h) => h()
}
</script>
