import React, { useState } from 'react';
import axios from 'axios';
import {
  ChakraProvider,
  Box,
  Button,
  Flex,
  Heading,
  Text,
  useToast,
  Input,
  Select,
  extendTheme,
  Textarea,
} from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      500: '#FF0080',
      600: '#FFA500',
      700: '#00FFFF',
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold',
      },
      variants: {
        solid: (props) => ({
          bg: 'brand.500',
          color: 'white',
          _hover: {
            bg: 'brand.600',
          },
        }),
      },
    },
    Text: {
      baseStyle: {
        color: 'gray.700',
      },
    },
    Box: {
      baseStyle: {
        p: 4,
        bg: 'red.100',
        borderRadius: 'md',
        color: 'red.800',
      },
    },
  },
});

const App = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userName, setUserName] = useState('');
  const [userTag, setUserTag] = useState('');
  const [prompt, setPrompt] = useState('');
  const [voice, setVoice] = useState('');
  const [userPhoto, setUserPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [showGenerationNote, setShowGenerationNote] = useState(false);
  const toast = useToast();

  const handleNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handleGenerateVideo = async () => {
    setLoading(true);
    setShowGenerationNote(true);
    try {
      const formData = new FormData();
      formData.append('user_name', userName);
      formData.append('user_tag', userTag);
      formData.append('tweet_text', prompt);
      formData.append('voice_type', voice);
      if (userPhoto) {
        formData.append('user_photo', userPhoto);
      }

      const response = await axios.post(
        'https://myrapidshorts-h67lx7up6a-uc.a.run.app/generate_video/',
        formData,
      );

      if (response.status === 200) {
        setVideoUrl(response.data.video_url);
      } else {
        toast({
          title: 'Error',
          description: 'Invalid video response from the API',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate video. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
      setShowGenerationNote(false); // Hide the generation note after the process is complete or fails
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Input placeholder="User Name" value={userName} onChange={(e) => setUserName(e.target.value)} size="lg" />;
      case 2:
        return <Input placeholder="User Tag (@example)" value={userTag} onChange={(e) => setUserTag(e.target.value)} size="lg" />;
      case 3:
        return (
          <Textarea
            placeholder="Enter tweet text here"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            size="lg"
            maxLength={512}
            height="150px"
          />
        
        );
      case 4:
        return (
          <Select placeholder="Select voice type" value={voice} onChange={(e) => setVoice(e.target.value)} size="lg">
            <option value="alloy">Alloy</option>
            <option value="echo">Echo</option>
            <option value="fable">Fable</option>
            <option value="onyx">Onyx</option>
            <option value="nova">Nova</option>
            <option value="shimmer">Shimmer</option>
          </Select>
        );
      case 5:
        return (
          <>
            <Text fontSize="md" color="gray.600" mb={2}>

            Upload a user photo:
            </Text>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setUserPhoto(e.target.files[0])}
              size="lg"
            />
          </>
        );
      default:
        return (
          <>
            <Text fontSize="md" color="gray.600" mb={2}>
              Preparing to generate your video...
            </Text>
            {showGenerationNote && (
              <Box p={4} bg="blue.100" borderRadius="md" mt={4}>
                <Text fontSize="lg" color="blue.800">
                  It may take more than a minute, please be patient.
                </Text>
              </Box>
            )}
          </>
        );
    }
  };

  return (
    <ChakraProvider theme={theme}>
      <Flex direction="column" alignItems="center" justifyContent="center" minH="100vh" p={4} backgroundSize="cover" position="relative" bgGradient="linear(to-t, #FF0080, #00FFFF)">
        <Box maxW="container.md" bg="lightblue" borderRadius="lg" boxShadow="0px 8px 26px 0px rgba(0, 0, 0, 0.1)" p={8} borderRadius="2xl" textAlign="center" zIndex="2" borderColor="brand.500" borderWidth="1px">
          <Heading mb={4} size="2xl" color="brand.500">Rapidshorts🚀</Heading>
          <Text mb={6} color="gray.800">
            Create amazing short videos from tweets! Coming soon: AI Images, multiple template selection, and 40+ different voices along with Twitter automation.
          </Text>

          
          {renderStepContent()}
          {currentStep === 3? (
            
          <Text fontSize="sm" color="gray.500" mt={2}>
          {prompt.length}/512 characters
        </Text>):null}
          {currentStep < 6 ? (
            <Button onClick={handleNextStep} colorScheme="teal" mt={4}>Next</Button>
          ) : (
            <Button onClick={handleGenerateVideo} isLoading={loading} colorScheme="pink" mt={4}>
              {loading ? 'Generating Video...' : 'Generate Video'}
            </Button>
          )}
          {videoUrl && (
            <Box mt={6}>
              <video controls width="60%">
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </Box>
          )}
        </Box>
      </Flex>
    </ChakraProvider>
  );
};

export default App;

             
