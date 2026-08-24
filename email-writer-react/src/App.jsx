import { useState } from 'react'
import axios from 'axios'

import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

const tones = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'assertive', label: 'Assertive' },
]

function App() {
  const [emailContent, setEmailContent] = useState('')
  const [tone, setTone] = useState('')
  
  const [generatedReply, setGeneratedReply] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handleSubmit = async () => {
    if (!emailContent.trim()) {
      setError('Please enter the original email first.')
      return
    }

    setLoading(true)
    setError('')
    setGeneratedReply('')

    try {
      const response = await axios.post(
        'http://localhost:8080/api/email/generate',
        {
          emailContent,
          tone
        }
      )

      const reply =
        typeof response.data === 'string'
          ? response.data.replace(/\\n/g, '\n')
          : JSON.stringify(response.data)

      setGeneratedReply(reply)
    } catch (err) {
      console.error(err)
      
      if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to the server. Is the Spring Boot backend running on localhost:8080?')
      } else {
        setError('Failed to generate the email reply. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedReply)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleClear = () => {
    setEmailContent('')
    setTone('')
    setGeneratedReply('')
    setError('')
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa', py: 6 }}>
      <Container maxWidth="md">
        
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 1 }}>
            Email Reply Generator
          </Typography>
          <Typography variant="body1" sx={{ color: '#595959' }}>
            Draft precise and tailored email responses instantly.
          </Typography>
        </Box>

        {/* Input Section */}
        <Paper variant="outlined" sx={{ mb: 4, backgroundColor: '#ffffff', borderRadius: 2, overflow: 'hidden' }}>
          
          <Box sx={{ p: 4 }}>
            <Typography variant="subtitle2" sx={{ textTransform: 'uppercase', color: '#595959', mb: 2, letterSpacing: 1 }}>
              Message Context
            </Typography>

            <TextField
              fullWidth
              multiline
              minRows={5}
              maxRows={10}
              placeholder="Paste the incoming email here..."
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              variant="outlined"
              sx={{ mb: 3 }}
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
              <FormControl fullWidth size="small" sx={{ maxWidth: 300 }}>
                <InputLabel>Response Tone</InputLabel>
                <Select
                  value={tone}
                  label="Response Tone"
                  onChange={(e) => setTone(e.target.value)}
                >
                  <MenuItem value=""><em>Neutral (Default)</em></MenuItem>
                  {tones.map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Box>

          <Divider />
          
          <Box sx={{ p: 3, backgroundColor: '#fcfcfc', display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              disableElevation
              onClick={handleSubmit}
              disabled={!emailContent.trim() || loading}
              sx={{ px: 4, py: 1, textTransform: 'none', fontWeight: 600, backgroundColor: '#1a1a1a' }}
            >
              Generate Draft
            </Button>

            <Button
              variant="text"
              onClick={handleClear}
              disabled={loading}
              sx={{ px: 3, textTransform: 'none', color: '#595959' }}
            >
              Clear
            </Button>
          </Box>
        </Paper>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" variant="outlined" sx={{ mb: 4, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Output Section */}
        {(generatedReply || loading) && (
          <Paper variant="outlined" sx={{ p: 4, backgroundColor: '#ffffff', borderRadius: 2 }}>
            <Typography variant="subtitle2" sx={{ textTransform: 'uppercase', color: '#595959', mb: 2, letterSpacing: 1 }}>
              {loading ? 'Drafting Response...' : 'Generated Draft'}
            </Typography>

            {loading ? (
              <Box sx={{ mb: 3 }}>
                <Skeleton animation="wave" height={24} width="80%" sx={{ mb: 1 }} />
                <Skeleton animation="wave" height={24} sx={{ mb: 1 }} />
                <Skeleton animation="wave" height={24} sx={{ mb: 1 }} />
                <Skeleton animation="wave" height={24} width="60%" />
              </Box>
            ) : (
              <TextField
                fullWidth
                multiline
                value={generatedReply}
                InputProps={{
                  readOnly: true,
                  sx: { backgroundColor: '#f5f5f5', color: '#1a1a1a', lineHeight: 1.6 }
                }}
                sx={{ mb: 3 }}
              />
            )}

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                variant="outlined"
                onClick={handleCopy}
                disabled={loading}
                sx={{ textTransform: 'none', fontWeight: 600, borderColor: '#d9d9d9', color: '#1a1a1a' }}
              >
                {copied ? '✓ Copied' : 'Copy to Clipboard'}
              </Button>
              
              <Button
                variant="outlined"
                onClick={() => {
                  window.location.href = `mailto:?body=${encodeURIComponent(generatedReply)}`
                }}
                disabled={loading}
                sx={{ textTransform: 'none', fontWeight: 600, borderColor: '#d9d9d9', color: '#1a1a1a' }}
              >
                Open in Mail Client
              </Button>
            </Stack>
          </Paper>
        )}

      </Container>

      <Snackbar
        open={copied}
        autoHideDuration={2000}
        onClose={() => setCopied(false)}
        message="Text copied successfully"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  )
}

export default App