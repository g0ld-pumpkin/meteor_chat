tinymce.init({
  selector: '#profileEditor',
  skin_url: '/packages/teamon_tinymce/skins/lightgray',
  statusbar: true,
  height: '200px',
  toolbar: 'fontselect | formatselect | bold italic underline | forecolor | alignleft aligncenter alignright | bullist | image link | code | backcolor',
  menubar: false,
  plugins: 'advlist textcolor colorpicker code link image lists hr',
});
