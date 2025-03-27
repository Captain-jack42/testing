const express = require('express');
const userrouter =  express.Router();
const path = require('path');
const axios = require('axios');
require('dotenv').config();

userrouter.get("/",(req,res,next) =>{
   res.sendFile(path.join(__dirname , '../' , 'view','home.html'));
  
})
userrouter.get("/contact",(req,res,next) =>{
  res.sendFile(path.join(__dirname , '../' , 'view','contact.html'));
 
})
userrouter.get("/destinations",(req,res,next) =>{
  res.sendFile(path.join(__dirname , '../' , 'view','destinations.html'));
 
})
userrouter.get("/packages",(req,res,next) =>{
  res.sendFile(path.join(__dirname , '../' , 'view','packages.html'));
 
})
userrouter.get("/services",(req,res,next) =>{
  res.sendFile(path.join(__dirname , '../' , 'view','services.html'));
 
})

userrouter.get("/about",(req,res,next) =>{
  res.sendFile(path.join(__dirname , '../' , 'view','about.html'));
})

userrouter.get("/terms",(req,res,next) =>{
  res.sendFile(path.join(__dirname , '../' , 'view','terms.html'));
})

userrouter.get("/privacy",(req,res,next) =>{
  res.sendFile(path.join(__dirname , '../' , 'view','privacy.html'));
})

userrouter.get("/faq",(req,res,next) =>{
  res.sendFile(path.join(__dirname , '../' , 'view','faq.html'));
})

userrouter.get("/login",(req,res,next) =>{
  res.sendFile(path.join(__dirname , '../' , 'view','login.html'));
})

userrouter.get("/payment",(req,res,next) =>{
    res.sendFile(path.join(__dirname , '../' , 'view','payment.html'));
  })

userrouter.get("/signup",(req,res,next) =>{
  res.sendFile(path.join(__dirname , '../' , 'view','signup.html'));
})

userrouter.get("/Hotel-Booking",(req,res,next) =>{
    res.sendFile(path.join(__dirname , '../' , 'view','hotelbooking.html'));
  })

  userrouter.get("/Flight-Booking",(req,res,next) =>{
    res.sendFile(path.join(__dirname , '../' , 'view','flightbooking.html'));
  })

  userrouter.get("/Car-Rentel",(req,res,next) =>{
    res.sendFile(path.join(__dirname , '../' , 'view','carrental.html'));
  })
  
  userrouter.get("/Tour-Packages",(req,res,next) =>{
    res.sendFile(path.join(__dirname , '../' , 'view','tourpackages.html'));
  })

userrouter.get("/search", async (req, res) => {
    try {
        const query = req.query.query;
        if (!query) {
            return res.status(400).json({ error: 'Search query is required' });
        }

        // First try to get monuments and attractions from Wikipedia
        try {
            // Get monuments and landmarks
            const monumentsResponse = await axios.get(
                `https://en.wikipedia.org/w/api.php`, {
                params: {
                    action: 'query',
                    format: 'json',
                    prop: 'extracts|pageimages|coordinates|images',
                    generator: 'search',
                    gsrsearch: `${query} monuments landmarks tourist attractions historical sites`,
                    gsrlimit: 10,
                    exintro: 1,
                    explaintext: 1,
                    piprop: 'original',
                    pithumbsize: 1000,
                    imlimit: 5,
                    origin: '*'
                }
            });

            if (monumentsResponse.data.query && monumentsResponse.data.query.pages) {
                const pages = monumentsResponse.data.query.pages;
                const results = await Promise.all(Object.values(pages).map(async page => {
                    // Extract the first sentence for the short description
                    const firstSentence = page.extract?.split('.')?.[0] + '.' || '';
                    // Get remaining text for detailed description
                    const remainingText = page.extract?.split('.').slice(1).join('.').trim() || '';

                    // Get Unsplash images for the location
                    const unsplashImages = [
                        `https://source.unsplash.com/featured/800x600/?${encodeURIComponent(page.title + ' monument landmark')}`,
                        `https://source.unsplash.com/featured/800x600/?${encodeURIComponent(page.title + ' tourism')}`,
                        `https://source.unsplash.com/featured/800x600/?${encodeURIComponent(page.title + ' architecture')}`
                    ];

                    // Add Wikipedia image if available
                    const imageUrls = [];
                    if (page.thumbnail && page.thumbnail.source) {
                        imageUrls.push(page.thumbnail.source);
                    }
                    // Add Unsplash images
                    imageUrls.push(...unsplashImages);

                    return {
                        title: page.title,
                        shortDescription: firstSentence,
                        fullDescription: remainingText,
                        images: imageUrls,
                        currentImageIndex: 0,
                        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title)}`,
                        coordinates: page.coordinates || null,
                        type: 'monument'
                    };
                }));

                // Add additional tourist information
                const touristInfo = {
                    title: `Tourist Guide for ${query}`,
                    shortDescription: `Essential tourist information for visiting ${query}.`,
                    fullDescription: `Best time to visit, local transportation, accommodation options, and cultural highlights.`,
                    images: [
                        `https://source.unsplash.com/featured/800x600/?${encodeURIComponent(query + ' cityscape')}`,
                        `https://source.unsplash.com/featured/800x600/?${encodeURIComponent(query + ' tourism')}`,
                        `https://source.unsplash.com/featured/800x600/?${encodeURIComponent(query + ' travel')}`
                    ],
                    currentImageIndex: 0,
                    url: `https://www.google.com/search?q=${encodeURIComponent(query + ' travel guide')}`,
                    type: 'guide'
                };

                results.unshift(touristInfo);

                // Add local experiences
                const localExperience = {
                    title: `Local Experiences in ${query}`,
                    shortDescription: `Discover authentic local experiences and cultural activities in ${query}.`,
                    fullDescription: `Local cuisine, traditional events, markets, and unique cultural experiences you shouldn't miss.`,
                    images: [
                        `https://source.unsplash.com/featured/800x600/?${encodeURIComponent(query + ' culture market')}`,
                        `https://source.unsplash.com/featured/800x600/?${encodeURIComponent(query + ' local food')}`,
                        `https://source.unsplash.com/featured/800x600/?${encodeURIComponent(query + ' festival')}`
                    ],
                    currentImageIndex: 0,
                    url: `https://www.google.com/search?q=${encodeURIComponent(query + ' local experiences culture')}`,
                    type: 'culture'
                };

                results.push(localExperience);

                return res.json({ results });
            }
        } catch (wikiError) {
            console.error('Wikipedia API error:', wikiError);
        }

        // Fallback results if Wikipedia fails
        const fallbackAttractions = [
            {
                title: `Historical Monuments in ${query}`,
                shortDescription: `Explore the rich historical heritage and monuments of ${query}.`,
                fullDescription: `Discover ancient architecture, historical significance, and cultural importance of monuments in ${query}.`,
                images: [
                    `https://source.unsplash.com/featured/800x600/?${encodeURIComponent(query + ' monument')}`,
                    `https://source.unsplash.com/featured/800x600/?${encodeURIComponent(query + ' historical')}`,
                    `https://source.unsplash.com/featured/800x600/?${encodeURIComponent(query + ' architecture')}`
                ],
                currentImageIndex: 0,
                url: `https://www.google.com/search?q=${encodeURIComponent(query + ' historical monuments')}`,
                type: 'monument'
            },
            {
                title: `Famous Landmarks in ${query}`,
                shortDescription: `Visit the most iconic landmarks and tourist spots in ${query}.`,
                fullDescription: `Popular tourist attractions, viewing points, and must-visit locations that make ${query} famous.`,
                images: [
                    `https://source.unsplash.com/featured/800x600/?${encodeURIComponent(query + ' landmark')}`,
                    `https://source.unsplash.com/featured/800x600/?${encodeURIComponent(query + ' famous')}`,
                    `https://source.unsplash.com/featured/800x600/?${encodeURIComponent(query + ' tourist spot')}`
                ],
                currentImageIndex: 0,
                url: `https://www.google.com/search?q=${encodeURIComponent(query + ' famous landmarks')}`,
                type: 'landmark'
            },
            {
                title: `Cultural Heritage of ${query}`,
                shortDescription: `Experience the rich cultural heritage sites in ${query}.`,
                fullDescription: `Museums, art galleries, traditional architecture, and cultural centers that showcase the heritage of ${query}.`,
                images: [
                    `https://source.unsplash.com/featured/800x600/?${encodeURIComponent(query + ' heritage')}`,
                    `https://source.unsplash.com/featured/800x600/?${encodeURIComponent(query + ' museum')}`,
                    `https://source.unsplash.com/featured/800x600/?${encodeURIComponent(query + ' culture')}`
                ],
                currentImageIndex: 0,
                url: `https://www.google.com/search?q=${encodeURIComponent(query + ' cultural heritage sites')}`,
                type: 'culture'
            }
        ];

        res.json({ results: fallbackAttractions });

    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ 
            results: [{
                title: `Monuments in ${query}`,
                shortDescription: `Discover historical monuments and attractions in ${query}.`,
                fullDescription: `Explore the rich cultural heritage, historical monuments, and tourist attractions that make ${query} unique.`,
                images: [
                    `https://source.unsplash.com/featured/800x600/?${encodeURIComponent(query + ' monument')}`,
                    `https://source.unsplash.com/featured/800x600/?${encodeURIComponent(query + ' tourism')}`,
                    `https://source.unsplash.com/featured/800x600/?${encodeURIComponent(query + ' travel')}`
                ],
                currentImageIndex: 0,
                url: `https://www.google.com/search?q=${encodeURIComponent(query + ' monuments tourist attractions')}`,
                type: 'general'
            }]
        });
    }
});

module.exports = userrouter;