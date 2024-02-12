import React, { useState } from 'react';
import axios from 'axios';
import backgroundImage from './bgimg.jpeg';
import defaultImage from './xlogo.jpg';

import {
  ChakraProvider,
  Heading,
  Text,
  Button,
  VStack,
  Flex,
  Box,
  useToast,
} from '@chakra-ui/react';
import { Textarea } from '@chakra-ui/react';

const App = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [username, setUsername] = useState('');
  const [color, setColor] = useState('');
  const [bgColor, setBgColor] = useState('');
  const [font, setFont] = useState('');
  const [voiceName, setVoiceName] = useState('');
  const [temp, setTemp] = useState(0); // Default to 0
  const [logo, setLogo] = useState(null);
  const toast = useToast();

  const handleInputChange = (e) => {
    const inputText = e.target.value.slice(0, 256); // Limit character count to 256
    setPrompt(inputText);
  };

  const handleProfileNameChange = (e) => {
    setProfileName(e.target.value);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleColorChange = (e) => {
    setColor(e.target.value);
  };

  const handleBgColorChange = (e) => {
    setBgColor(e.target.value);
  };

  const handleFontChange = (e) => {
    setFont(e.target.value);
  };

  const handleVoiceNameChange = (e) => {
    setVoiceName(e.target.value);
  };

  const handleTempChange = (e) => {
    setTemp(parseInt(e.target.value));
  };

  const handleLogoChange = (e) => {
    setLogo(e.target.files[0]);
  };

  const defaultImageFile = new File([defaultImage], 'xlogo.jpg', { type: 'image/jpeg' });

  const generateVideo = async () => {
    try {
      setLoading(true);
      // Clear the videoUrl and hide the video container
      setVideoUrl('');
      
      const formData = new FormData();
      formData.append('profile_name', profileName);
      formData.append('username', username);
      formData.append('color', color);
      formData.append('bgcolor', bgColor);
      formData.append('font', font);
      formData.append('voice_name', voiceName);
      formData.append('temp', temp);
      formData.append('text', prompt);
      
      // Check if logo is provided, if not, use defaultImageFile
      if (logo) {
        formData.append('logo', logo);
      } else {
        formData.append('logo', defaultImageFile);
      }

      const response = await axios.post(
        'https://rapidshortsfeb1-h67lx7up6a-uc.a.run.app/generate_video/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'accept': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        const videoUrl = response.data.video_blob_name;
        setVideoUrl(videoUrl);
      } else {
        console.error('Invalid video response from the API');
      }
    } catch (error) {
      console.error('Error generating video:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate video. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChakraProvider>
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        minH="100vh"
        p={4}
        backgroundImage={`url(${backgroundImage})`}
        backgroundSize="cover"
        position="relative"
      >
        <Box
          maxW="container.md"
          bg="rgba(255, 255, 255, 0.9)"
          borderRadius="lg"
          boxShadow="lg"
          p={8}
          borderRadius="2xl"
          textAlign="center"
          zIndex="2"
          transition="transform 0.3s ease-in-out"
          _hover={{ transform: 'rotate(0deg)' }}
        >
          <Heading
            mb={4}
            size="2xl"
            // Use gradient for title color
            bgGradient="linear(to-l, #7928CA,#FF0080)"
            bgClip="text"
            textShadow="2px 2px 4px #000"
          >
            Rapidshorts🚀
          </Heading>
          <Text mb={4} fontSize="lg" color="gray.700">
            Create amazing short videos from tweets or any text! Enter your text, select options, and click "Generate Video". All under 2 mins.
          </Text>

          <Textarea
            value={prompt}
            onChange={handleInputChange}
            placeholder="Enter text to generate video"
            size="lg"
            maxLength={256}
            bg="white"
            color="gray.800"
            borderRadius="md"
            p={4}
            fontSize="lg"
            style={{ height: 'auto', minHeight: '150px' }}
          />
          <Box
            position="absolute"
            bottom="5px"
            right="10px"
            fontSize="sm"
            // Set br tag color to white
            color="white"
          >
            Character Count: {prompt.length}/256
          </Box>

          <Flex justifyContent="space-between" mb={4}>
            <input
              type="text"
              placeholder="Profile Name"
              onChange={handleProfileNameChange}
              style={{ width: '30%', padding: '10px' }}
            />
            <input
              type="text"
              placeholder="@Username"
              onChange={handleUsernameChange}
              style={{ width: '30%', padding: '10px' }}
            />
            <input
              type="text"
              placeholder="Font Color"
              onChange={handleColorChange}
              style={{ width: '30%', padding: '10px' }}
            />
          </Flex>

          <Flex justifyContent="space-between" mb={4}>
            <input
              type="text"
              placeholder="Font Bg Color"
              onChange={handleBgColorChange}
              style={{ width: '30%', padding: '10px' }}
            />
            <select
              onChange={handleFontChange}
              style={{ width: '30%', padding: '10px' }}
            >
              <option value="">Select Font Style</option>
              <option value="Times-Bold">Times-Bold</option>
              <option value="Times-Bold-Italic">Times-Bold-Italic</option>
              <option value="Times-Italic">Times-Italic</option>
              <option value="Times-New-Roman">Times-New-Roman</option>
              <option value="Times-New-Roman-Bold">Times-New-Roman-Bold</option>
              <option value="Times-New-Roman-Bold-Italic">Times-New-Roman-Bold-Italic</option>
              <option value="Times-New-Roman-Italic">Times-New-Roman-Italic</option>
              <option value="Times-Roman">Times-Roman</option>
            </select>
            <select
              onChange={handleVoiceNameChange}
              style={{ width: '30%', padding: '10px' }}
            >
              <option value="">Select Voice Type</option>
              <option value="alloy">Alloy</option>
              <option value="echo">Echo</option>
              <option value="fable">Fable</option>
              <option value="onyx">Onyx</option>
              <option value="nova">Nova</option>
              <option value="shimmer">Shimmer</option>
            </select>
          </Flex>

          <Flex justifyContent="space-between" mb={4}>
            <input
              type="number"
              placeholder="Template no. (0-7)"
              onChange={handleTempChange}
              style={{ width: '30%', padding: '10px' }}
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              style={{ width: '30%', padding: '10px' }}
            />
          </Flex>

          <Button
            onClick={generateVideo}
            isLoading={loading}
            loadingText="Generating takes up to a min..."
            size="lg"
            bgGradient="linear(to-r, #FF1493, #00FFFF)"
            color="white"
            borderRadius="md"
            _hover={{ bgGradient: 'linear(to-r, #00FFFF, #FF1493)' }}
            mt={4}
          >
            Generate Video
          </Button>
          {!loading && videoUrl ? (
            <Box mt={6}>
              <video
                controls
                width="60%"
                height="auto"
                style={{ maxWidth: '100%' }}
              >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </Box>
          ) : (
            loading ? (
              <Text>Loading...</Text>
            ) : null
          )}
        </Box>
        <Box mt={6} textAlign="left" fontSize="sm" color='white'>
          <Text>
            Template Info:
            <br />
            0: Plain white background (bg_white)
            <br />
            1: Blue background (bg_blue)
            <br />
            2: Blue gradient background (bg_bluegrad)
            <br />
            3: Dark gradient background (bg_darkgrad)
            <br />
            4: Dark gradient background (bg_darkgrad)
            <br />
            5: Gradient background (bg_gradainat normal)
            <br />
            6: Olive background (bg_olive)
            <br />
            7: Purple background (bg_purple)
          </Text>
        </Box>
      </Flex>
    </ChakraProvider>
  );
};

export default App;
