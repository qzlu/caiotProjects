
import {FileUpLoad} from '@/caiot/request/api.js'//api接口（接口统一管理）
export default{
  install (Vue, options) {
    Vue.prototype.getPdf = function (id,title) {
      html2canvas(document.querySelector(id), {
        allowTaint: true
      }).then(function (canvas) {
        let contentWidth = canvas.width
        let contentHeight = canvas.height
        let pageHeight = contentWidth / 592.28 * 841.89
        let leftHeight = contentHeight
        let position = 0
        let imgWidth = 595.28
        let imgHeight = 592.28 / contentWidth * contentHeight
        /*let imgWidth = 595.28
        let imgHeight = 592.28 / contentWidth * contentHeight*/
        let pageData = canvas.toDataURL('image/jpeg', 1.0)
        let PDF = new jsPDF('', 'pt', 'a4')
        if (leftHeight < pageHeight) {
          PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
        } else {
          while (leftHeight > 0) {
            PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
            leftHeight -= pageHeight
            position -= 841.89
            if (leftHeight > 0) {
              PDF.addPage()
            }
          }
        }
        PDF.save(title + '.pdf')
       
        
        
        
      }
      )
    };
    Vue.prototype.fileUpload = async function(id,fileName){
      new Promise(resolve => {
        this.$nextTick(() => {
          resolve()
        })
      })
      html2canvas(document.querySelector(id)).then(canvas => {
        var srccc = canvas.toDataURL("image/png");
        /*生成图片传给服务器*/
        FileUpLoad({
            FAction:'SaveInspectionReportJpg2Pdf',
            FData: srccc.replace("data:image/png;base64,", ""),
            FName: fileName
        })
        .then(data => {
        })
        .catch(error => {
          console.log('cuowu',error);
        })
        /*end of 生成图片传给服务器*/
      })
    }
  }

}