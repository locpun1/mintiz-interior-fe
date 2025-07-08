import { Box, IconButton, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { FiberManualRecord } from "@mui/icons-material";
import { IImageSlide } from "@/types/settings";
import { getSlides } from "@/services/settings-service";
import { getPathImage } from "@/utils/url";
import image_slide from '@/assets/images/users/image-slide.jpeg';
import image_slide_1 from '@/assets/images/users/image-slide -1.jpeg';

interface SrcSetWidth extends IImageSlide{
    srcSet1200: string,
    srcSet768: string
}

const fixedImages: SrcSetWidth[] = [
    {id: 1, name: 'image_slide', url: `${image_slide}`, srcSet1200: `${image_slide}`, srcSet768: `${image_slide_1}` },
    {id: 2, name: 'image_slide_1', url: `${image_slide_1}`, srcSet1200: `${image_slide}`, srcSet768: `${image_slide_1}`},

]

const ImageCarousel: React.FC = () => {
  const [images, setImages] = useState<SrcSetWidth[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const fetchSlides = async () => {
      const res = await getSlides({ size: rowsPerPage, page: page});
      const data = res.data?.slides as any as IImageSlide[];
      const newData: SrcSetWidth[] = data.map(
        (slide) => ({
          id: slide.id,
          name: slide.name,
          url: getPathImage(slide.url),
          createdAt: slide.createdAt,
          updatedAt: slide.updatedAt,
          srcSet1200: getPathImage(slide.url),
          srcSet768: getPathImage(slide.url),
        })
      )
      setImages(newData)
    }
    fetchSlides()
  }, [rowsPerPage, page])

  const displayImages = images.length > 0 ? images : fixedImages;
  const totalSlides = displayImages.length;

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % totalSlides;
      setPrevIndex(currentIndex);
      setCurrentIndex(nextIndex);
      setFade(true);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, totalSlides]);

  useEffect(() => {
    if (fade) {
      const timeout = setTimeout(() => setFade(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [fade]);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100vw",
        overflow: "hidden",
        height: { xs: 450, md: 600 },
      }}
    >
      {displayImages.length > 0 && (
        <>
          {/* Layer chứa ảnh trước */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              opacity: fade ? 0 : 1,
              transition: "opacity 0.5s ease-in-out",
              zIndex: 1,
            }}
          >
            <picture>
              <source media="(min-width: 1200px)" srcSet={displayImages[prevIndex]?.srcSet1200} />
              <source media="(min-width: 768px)" srcSet={displayImages[prevIndex]?.srcSet768} />
              <img
                src={displayImages[prevIndex].url}
                alt={`Slide ${prevIndex}`}
                style={{ 
                  width: "100%", 
                  height: "100%", 
                  objectFit: "fill" 
                }}
              />
            </picture>
          </Box>

          {/* Layer chứa ảnh mới */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              opacity: fade ? 1 : 0,
              transition: "opacity 0.5s ease-in-out",
              zIndex: 2,
            }}
          >
            <picture>
              <source media="(min-width: 1200px)" srcSet={displayImages[currentIndex]?.srcSet1200} />
              <source media="(min-width: 768px)" srcSet={displayImages[currentIndex]?.srcSet768} />
              <img
                src={displayImages[currentIndex].url}
                alt={`Slide ${currentIndex}`}
                style={{ 
                  width: "100%", 
                  height: "100%", 
                  objectFit: "cover" 
                }}
              />
            </picture>
          </Box>

          {/* Chấm điều hướng */}
          {displayImages.length > 1 && (
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                width: "100%",
                zIndex: 3,
              }}
            >
              <Stack direction="row" justifyContent="center" sx={{ mt: 1 }}>
                {displayImages.map((img, index) => (
                  <IconButton
                    key={img.id}
                    onClick={() => {
                      setPrevIndex(currentIndex);
                      setCurrentIndex(index);
                      setFade(true);
                    }}
                    size="small"
                    sx={{ color: currentIndex === index ? "black" : "grey.400" }}
                  >
                    <FiberManualRecord fontSize="small" />
                  </IconButton>
                ))}
              </Stack>
            </Box>
          )}
        </>
      )}

    </Box>
  );
};

export default ImageCarousel;

