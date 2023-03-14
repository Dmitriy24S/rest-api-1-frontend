const getGoogleOAuthURL = () => {
  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth'

  const options = {
    redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_OAUTH_REDIRECT_URL as string,
    client_id: process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID as string,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: [
      // .../auth/userinfo.email,
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ].join(' '),
  }
  console.log('getGoogleOAuthURL options', options)

  const qs = new URLSearchParams(options)
  // console.log('getGoogleOAuthURL qs', qs)
  console.log('getGoogleOAuthURL qs', qs.toString())
  // getGoogleOAuthURL qs redirect_uri=http%3A%2F%2Flocalhost%3A1337%2Fapi%2Fsessions%2Foauth%2Fgoogle&client_id=226624337900-grsp1vntie4m3ant5nmsukrrafsfjofk.apps.googleusercontent.com&access_type=offline&response_type=code&prompt=consent&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile

  return `${rootUrl}?${qs.toString()}`
}

export default getGoogleOAuthURL
