const mainwidth = 400
const mainheight = 400

let dataURItoBlob = dataURI => {
  // convert base64/URLEncoded data component to raw binary data held in a string
  var byteString
  if (dataURI.split(',')[0].indexOf('base64') >= 0)
    byteString = atob(dataURI.split(',')[1])
  else byteString = unescape(dataURI.split(',')[1])

  // separate out the mime component
  var mimeString = dataURI
    .split(',')[0]
    .split(':')[1]
    .split(';')[0]

  // write the bytes of the string to a typed array
  var ia = new Uint8Array(byteString.length)
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }

  return new Blob([ia], {
    type: mimeString
  })
}

 function myFunctionone()
    {
        var input = document.getElementById('title')
        var div = document.getElementById('divIDone');
        div.innerHTML = input.value;
    }

    function myFunctiontwo()
    {
        var input = document.getElementById('location')
        var div = document.getElementById('divIDtwo');
        div.innerHTML = input.value;
    }

let uploadPicture = () => {
  croppie
    .result({
      size: 'viewport'
    })
    .then(function (dataURI) {
      var formData = new FormData()
      formData.append('design', $('#fg').data('design'))
      formData.append('title', $('#title').val())
      formData.append('location', $('#location').val())
      formData.append('image', dataURItoBlob(dataURI))
      $.ajax({
        url: 'upload.php',
        data: formData,
        type: 'POST',
        contentType: false,
        processData: false,
        success: function (response) {
          console.log(response);
          let res = response;
          let results = JSON.parse(res);
          console.log(results);
      if (results.status === true) {
            console.log(results.message)
            let data = `<a class="btn btn-danger rounded-0" href="${results.data}" download>Download Image</a>`
            $('#imagedownload').html(data)
          } else {
            console.log(results.message)
          }
    },        error: function () {
          alert('Unable to create image')
        },
        xhr: function () {
          var myXhr = $.ajaxSettings.xhr()
          if (myXhr.upload) {
            myXhr.upload.addEventListener(
              'progress',
              function (e) {
                if (e.lengthComputable) {
                  var max = e.total
                  var current = e.loaded

                  var percentage = Math.round((current * 100) / max)
                  document.getElementById('download').innerHTML =
                    'Image generated!'
                }
              },
              false
            )
          }
          return myXhr
        }
      })
    })
}

let updatePreview = url => {
  document.getElementById('crop-area').innerHTML = ''
  window.croppie = new Croppie(document.getElementById('crop-area'), {
    url: url,
    boundary: {
      height: mainheight,
      width: mainwidth
    },
    viewport: {
      width: mainwidth,
      height: mainheight
    }
  })

  $('#fg').on('mouseover touchstart', function () {
    document.getElementById('fg').style.zIndex = -1
  })
  $('.cr-boundary').on('mouseleave touchend', function () {
    document.getElementById('fg').style.zIndex = 10
  })

  document.getElementById('download').click = function () {
    this.innerHTML = 'Please wait...'
    uploadPicture(function (r) {
      document.getElementById('download').innerHTML = 'Uploaded'
      window.location = 'download.php?i=' + r
    })
  }
  document.getElementById('download').removeAttribute('disabled')
}

let onFileChange = input => {
  if (input.files && input.files[0]) {
    var reader = new FileReader()

    reader.onload = function (e) {
      image = new Image()
      image.onload = function () {
        var width = this.width
        var height = this.height
        if (width >= mainwidth && height >= mainheight)
          updatePreview(e.target.result)
        else
          alert(
            `Image should be atleast have ${mainwidth}px width and ${mainheight}px height`
          )
      }
      image.src = e.target.result
    }

    reader.readAsDataURL(input.files[0])
  }
  $('#imagedownload').html('')
  $('#download')
    .text('Generate image')
    .show()
}

$(document).ready(function () {
  $('.design').on('click', function () {
    $('#fg')
      .attr('src', $(this).attr('src'))
      .data('design', $(this).data('design'))
    $('.design.active').removeClass('active')
    $(this).addClass('active')
  })
})
$('#download').hide()


function copyToClipboard(element) {
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val($(element).html()).select();
  var str = $(element).html();

  function listener(e) {
    e.clipboardData.setData("text/html", str);
    e.clipboardData.setData("text/plain", str);
    e.preventDefault();
  }
  document.addEventListener("copy", listener);
  document.execCommand("copy");
  document.removeEventListener("copy", listener);

  $temp.remove();
  $("#success").slideDown("slow");
}
