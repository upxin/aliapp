import { systemInfo } from '@/stores';

export async function changeImage() {
  // 图片限制大小
  const isIOS = systemInfo()?.app?.system.includes('iOS');
  console.log('isIOS', isIOS);

  const fileLimit = 2 * 1024 * 1024;
  // 选择图片原图或是压缩图
  const sizeType = isIOS ? ['compressed'] : ['original', 'compressed'];
  my.chooseMedia({
    sizeType,
    count: 9,
    mediaType: ['image'],
    sourceType: ['album', 'camera'],
    success: async function (res) {
      const tempFiles = res.tempFiles;
      if (tempFiles.length) {
        for (let i = 0; i < tempFiles.length; i++) {
          let filePath = tempFiles[i].tempFilePath;
          // 图片超过大小限制
          if (tempFiles[i].size > fileLimit) {
            // 手动压缩
            filePath = await compressFile(filePath, i, tempFiles[i].size);
          }
        }
      }
    },
  });
}

// 压缩
export function compressFile(src, i, size) {
  return new Promise((resolve) => {
    // 获取图片信息
    my.getImageInfo({
      src,
      success: (img) => {
        const imgWidth = img.width;
        const imgHeight = img.height;
        // 若宽高都小于4096，则使用canvas
        if (imgWidth <= 4096 && imgHeight <= 4096) {
          canvasToImg(src, i, imgWidth, imgHeight, size).then((res) => {
            resolve(res);
          });
        } else {
          // 强制压缩
          compressImage(src, size).then((res) => {
            resolve(res);
          });
        }
      },
      fail: () => {
        compressImage(src, size).then((res) => {
          resolve(res);
        });
      },
    });
  });
}

// 绘制canvas
export function canvasToImg(src, i, imgWidth, imgHeight, size) {
  return new Promise((resolve, reject) => {
    const { pixelRatio, baseSize } = data; // baseSize设为1280，与图片宽高做比较
    const query = my.createSelectorQuery().in(this);
    query
      .select(`#myCanvas${i}`)
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res[0].node;
        if (!canvas) {
          // 强制压缩
          compressImage(src, size).then((res) => {
            resolve(res);
          });
          return;
        }
        const ctx = canvas.getContext('2d');
        const pic = canvas.createImage();
        pic.src = src;
        let canvasWidth = 0;
        let canvasHeight = 0;
        let quality = 1;
        // 图片宽和高都小于基础值，则宽高不变，压缩质量为0.3，这里的基础值设为1280
        if (imgWidth <= baseSize && imgHeight <= baseSize) {
          canvasWidth = imgWidth;
          canvasHeight = imgHeight;
          quality = 0.3;
        } else {
          let compareFlag = true;
          // 手机宽高比大于2，图片一边大于基础值，一边小于基础值，则宽高不变，压缩质量为0.3
          if (
            pixelRatio > 2 &&
            (imgWidth < baseSize || imgHeight < baseSize) &&
            (imgWidth > baseSize || imgHeight > baseSize)
          ) {
            canvasWidth = imgWidth;
            canvasHeight = imgHeight;
            quality = 0.3;
          } else {
            // 手机宽高比大于2，宽高最小值设为基础值，另一边等比缩放，手机宽高比小于等于2，宽高最大值设为基础值，另一边等比缩放，压缩质量为0.9
            compareFlag =
              pixelRatio > 2 ? imgWidth > imgHeight : imgWidth < imgHeight;
            canvasWidth = compareFlag
              ? parseInt(imgWidth / (imgHeight / baseSize))
              : baseSize;
            canvasHeight = compareFlag
              ? baseSize
              : parseInt(imgHeight / (imgWidth / baseSize));
            quality = 0.9;
          }
        }
        // 设置canvas宽高
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        pic.onerror = () => {
          // 图片加载失败则继续强制压缩
          compressImage(src, size).then((response) => {
            resolve(response);
          });
        };
        pic.onload = () => {
          ctx.clearRect(0, 0, canvasWidth, canvasHeight);
          ctx.drawImage(pic, 0, 0, canvasWidth, canvasHeight);
          my.canvasToTempFilePath({
            canvas,
            quality,
            fileType: 'jpg',
            width: canvasWidth,
            height: canvasHeight,
            destWidth: canvasWidth,
            destHeight: canvasHeight,
            success: (resp) => {
              // 生成的图片临时文件路径
              resolve(resp.tempFilePath);
              ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            },
            fail: () => {
              compressImage(src, size).then((response) => {
                resolve(response);
              });
            },
          });
        };
      });
  });
}

// 强制压缩
export function compressImage(src, size) {
  const isIOS = systemInfo()?.app?.system.includes('iOS');
  console.log('isIOS', isIOS);
  return new Promise((resolve, reject) => {
    let quality = 100;
    // ios因为自己有压缩机制，压缩到极致就不会再压，因此往小了写
    if (isIOS) {
      quality = 0.1;
    } else {
      const temp = 30 - parseInt(size / 1024 / 1024);
      quality = temp < 10 ? 10 : temp;
    }
    my.compressImage({
      src, // 图片路径
      quality, // 压缩质量
      success: function (res) {
        resolve(res.tempFilePath);
      },
      fail: function (err) {
        resolve(src);
      },
    });
  });
}
