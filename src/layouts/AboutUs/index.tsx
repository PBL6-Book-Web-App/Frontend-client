import React from "react";
import { Typography, Grid, Card, CardContent, Box } from "@mui/material";
import { ABOUT_US } from "../../data/aboutUs";

const AboutUs = () => {
  const { title, whoWeAre, whatWeDo, story, team } = ABOUT_US;
  return (
    <Box maxWidth="lg" paddingY={"1rem"} margin={"auto"} marginTop={"20px"}>
      <Typography variant="h2" align="center" gutterBottom>
        {title}
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} paddingY={"1rem"}>
          {whoWeAre}
        </Grid>
        <Grid item xs={12} paddingY={"1rem"}>
          <Typography variant="h4">What We Do</Typography>
          {whatWeDo}
        </Grid>
        <Grid item xs={12} paddingY={"1rem"}>
          <Typography variant="h4">Our Story</Typography>
          {story}
        </Grid>
        <Grid container xs={12} padding={"1rem"} spacing={1}>
          <Typography variant="h4">Team Members</Typography>
          {team.map((member: any) => (
            <Grid item xs={12} md={6} paddingY={"1rem"} key={member.name}>
              <Card key={member.name} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h5">{member.name}</Typography>
                  <Typography variant="body2">{member.role}</Typography>
                  {member.bio && (
                    <Typography variant="body2">{member.bio}</Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
};

export default AboutUs;
