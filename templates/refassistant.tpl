<script type="text/javascript" src="{@RELATIVE_WCF_DIR}js/Refassistant.class.js"></script>
<script type="text/javascript">
//<![CDATA[
var r = new Refassistant();
r.search({@$refassistant_url|json_encode}, {@$refassistant_keyword|json_encode});
document.observe('dom:loaded', r.display.bind(r));
//]]>
</script>
