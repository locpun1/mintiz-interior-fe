import { Box, IconButton, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import slide_image_1 from "@/assets/images/users/slide-image - 1.jpg";
import slide_image_2 from "@/assets/images/users/slide-image-2.jpg";
import slide_image_3 from "@/assets/images/users/home-image.png";
import slide_image_4 from "@/assets/images/users/slide-image-3.jpg";
import slide_image_5 from "@/assets/images/users/slide-image-4.jpg";

import { FiberManualRecord } from "@mui/icons-material";

const images = [
    {id: 1, url: `${slide_image_1}`},
    {id: 2, url: `${slide_image_2}`},
    {id: 3, url: `${slide_image_3}`},
    {id: 4, url: `${slide_image_4}`},
    {id: 5, url: `${slide_image_5}`},

]

const ImageCarousel: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [prevIndex, setPrevIndex] = useState(0);
    const [fade, setFade] = useState(false);
    const totalSlides = images.length;

    useEffect(() => {
        const interval = setInterval(() => {
            const nextIndex = (currentIndex + 1) % totalSlides;
            setPrevIndex(currentIndex);
            setCurrentIndex(nextIndex);
            setFade(true);
        },5000); // chuyển ảnh mỗi 5 giây

        return () =>  clearInterval(interval); // clear khi component bị hủy;
    }, [currentIndex,totalSlides]);

    
    const handleDotClick = (index: number) => {
        setPrevIndex(currentIndex);
        setCurrentIndex(index);
        setFade(true);
    };

    useEffect(() => {
    if (fade) {
      const timeout = setTimeout(() => {
        setFade(false);
      }, 500); // thời gian giống transition
      return () => clearTimeout(timeout);
    }
    }, [fade]);

    return(
        <Box 
            sx={{ 
                position: 'relative', 
                width: "100vw", // Tràn full chiều ngang
                flexGrow: 1, 
                overflow: "hidden",
                height: {xs: 450, md: 600},
            }}
        >
        {/* Layer chứa 2 ảnh chồng nhau */}
            <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
                {/* Ảnh cũ */}
                <Box
                sx={{
                    backgroundImage: `url(${images[prevIndex].url})`,
                    backgroundSize: "100% 100%",
                    backgroundPosition: "center",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    transition: "opacity 0.5s ease-in-out",
                    opacity: fade ? 0 : 1,
                    zIndex: 1,
                }}
                />
                {/* Ảnh mới */}
                <Box
                sx={{
                    backgroundImage: `url(${images[currentIndex].url})`,
                    backgroundSize: "100% 100%",
                    backgroundPosition: "center",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    transition: "opacity 0.5s ease-in-out",
                    opacity: fade ? 1 : 0,
                    zIndex: 2,
                }}
                />
            </Box>
            {/* Chấm tròn điều hướng */}
            <Box 
                sx={{
                    position: 'absolute',
                    bottom: 0,
                    width: "100%",
                    margin: 'auto',
                    zIndex: 3, // Quan trọng: đảm bảo nằm trên 2 ảnh
                }}
            >
                <Stack direction='row' justifyContent='center' sx={{ mt: 1}}>
                    {images.map((img, index) => (
                        <IconButton
                            key={img.id}
                            onClick={() => handleDotClick(index)}
                            size="small"
                            sx={{ color: currentIndex === index ? 'black' : 'grey.400'}}
                        >
                            <FiberManualRecord fontSize="small"/>
                        </IconButton>
                    ))}
                </Stack>
            </Box>

        </Box>
    )
}

export default ImageCarousel;