import { AddIcon } from '@chakra-ui/icons';
import { Box, Button, Checkbox, FormControl, FormLabel, HStack, Input, Stack, Textarea, VStack } from "@chakra-ui/react";
import React, { useState } from 'react';
import Frame from 'react-frame-component';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

interface ExperienceType {
  company: string;
  position: string;
  description: string;
  startDate: string;
  endDate: string;
  role: string;
  current: boolean;
}

interface SkillType {
  name: string;
  level: string;
}

function SkillsComponent({ skills, setSkills }: { skills: SkillType[]; setSkills: React.Dispatch<React.SetStateAction<SkillType[]>> }) {
  const addSkill = () => {
    const newSkill: SkillType = { name: '', level: '' };
    setSkills([...skills, newSkill]);
  };

  const updateSkill = (index: number, field: keyof SkillType, value: string) => {
    const newSkills = [...skills];
    newSkills[index][field] = value;
    setSkills(newSkills);
  };

  const removeSkill = (index: number) => {
    const newSkills = [...skills];
    newSkills.splice(index, 1);
    setSkills(newSkills);
  };

  return (
    <Stack>
      {skills.map((skill, index) => (
        <HStack key={index}>
          <FormControl>
            <FormLabel>Skill</FormLabel>
            <Input value={skill.name} onChange={(e) => updateSkill(index, 'name', e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel>Level</FormLabel>
            <Input value={skill.level} onChange={(e) => updateSkill(index, 'level', e.target.value)} />
          </FormControl>
          <Button colorScheme="red" onClick={() => removeSkill(index)}>
            Remove
          </Button>
        </HStack>
      ))}
      <Button onClick={addSkill}>Add Skill</Button>
    </Stack>
  );
}


interface PersonalInfoType {
  name: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  twitter: string;
}

function PersonalInfoComponent({ personalInfo, setPersonalInfo }: { personalInfo: PersonalInfoType; setPersonalInfo: React.Dispatch<React.SetStateAction<PersonalInfoType>> }) {
  const updateInfo = (field: keyof PersonalInfoType, value: string) => {
    setPersonalInfo({ ...personalInfo, [field]: value });
  };

  return (
    <Stack direction={"row"}>
      <FormControl>
        <FormLabel>Full Name</FormLabel>
        <Input value={personalInfo.name} onChange={(e) => updateInfo('name', e.target.value)} />
      </FormControl>
      <FormControl>
        <FormLabel>City</FormLabel>
        <Input value={personalInfo.city} onChange={(e) => updateInfo('city', e.target.value)} />
      </FormControl>
      <FormControl>
        <FormLabel>Country</FormLabel>
        <Input value={personalInfo.country} onChange={(e) => updateInfo('country', e.target.value)} />
      </FormControl>
      <FormControl>
        <FormLabel>Phone</FormLabel>
        <Input value={personalInfo.phone} onChange={(e) => updateInfo('phone', e.target.value)} />
      </FormControl>
      <FormControl>
        <FormLabel>Email</FormLabel>
        <Input value={personalInfo.email} onChange={(e) => updateInfo('email', e.target.value)} />
      </FormControl>
    </Stack>
  );
}


interface ProgrammingLanguageType {
  language: string;
  description: string;
}

const ResumeBuilder: React.FC = () => {
  const [skills, setSkills] = useState<SkillType[]>([]);
  const [experiences, setExperiences] = useState<ExperienceType[]>([
    { company: '', position: '', description: '', startDate: '', endDate: '', role: '', current: false },
  ]); const [markdown, setMarkdown] = useState<string>('');

  // Initialize states
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    address: '',
    city: '',
    country: '',
    phone: '',
    email: '',
    twitter: '',
  });

  const [education, setEducation] = useState([
    { degree: '', school: '', startYear: '', endYear: '', description: '' },
  ]);

  const [programmingLanguages, setProgrammingLanguages] = useState([
    { language: '', description: '' },
  ]);


  const handleSubmit = () => {
    setMarkdown(createResumeMarkdown());
  };

  const updateExperience = (index: number, field: keyof ExperienceType, value: string | boolean) => {
    const newExperiences = [...experiences];
    // newExperiences[index][field] = value;
    setExperiences(newExperiences);
  };

  // Adding a new experience field
  const addExperience = () => {
    setExperiences([...experiences, { company: '', position: '', description: '', startDate: '', endDate: '', role: '', current: false }]);
  };

  const removeExperience = (index: number) => {
    const newExperiences = [...experiences];
    newExperiences.splice(index, 1);
    setExperiences(newExperiences);
  }

  const createResumeMarkdown = () => {
    let markdown = '';

    // ... other sections

    markdown += '## Experience\n\n';
    experiences.forEach(exp => {
      markdown += `### ${exp.company}\n`;
      markdown += `**${exp.position}**\n`;
      markdown += `_${new Date(exp.startDate).toLocaleDateString()} - ${exp.current ? new Date().toLocaleDateString() : new Date(exp.endDate).toLocaleDateString()}_\n`;
      markdown += `${exp.role}\n`;
      markdown += exp.description.split('\n').map(line => `- ${line}`).join('\n') + '\n\n';
    });

    return markdown;
  };
  console.log(markdown)


  interface MarkdownRenderProps {
    children?: React.ReactNode;
  }


  return (
    <Box display="flex">
      <VStack flex="1" padding="10">
        {/* <PersonalInfoComponent personalInfo={personalInfo} setPersonalInfo={setPersonalInfo} /> */}
      </VStack>
      <VStack flex="1" padding="10">
        {experiences.map((exp, index) => (
          <Stack key={index} direction="row" alignItems="center">
            {/* Other fields here */}
            <FormControl>
              <FormLabel>Company Name</FormLabel>
              <Input
                value={exp.company}
                onChange={e => updateExperience(index, 'company', e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Role</FormLabel>
              <Input
                value={exp.role}
                onChange={e => updateExperience(index, 'role', e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={exp.description}
                onChange={e => updateExperience(index, 'description', e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Start Date</FormLabel>
              <Input
                type="date"
                value={exp.startDate}
                onChange={e => updateExperience(index, 'startDate', e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>End Date</FormLabel>
              <Input
                type="date"
                value={exp.endDate}
                onChange={e => updateExperience(index, 'endDate', e.target.value)}
                disabled={exp.current}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Current Position</FormLabel>
              <Checkbox
                isChecked={exp.current}
                onChange={e => updateExperience(index, 'current', e.target.checked)}
              />
            </FormControl>
            {/* Other fields here */}
          </Stack>
        ))
        }
        <SkillsComponent setSkills={setSkills} skills={skills} />
        <Button leftIcon={<AddIcon />} onClick={addExperience}>Add Experience</Button>

        <Button onClick={handleSubmit}>Submit</Button>
      </VStack>
      <Box flex="1" padding="10">
        {markdown && (
          <Frame height={"100%"}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{`
Johnny Coder
============

-------------------     ----------------------------
1 MyAddress                        email@example.com
MyTown 1000                          @twitter_handle
MyCountry                           1800 my-phone-nr
-------------------     ----------------------------

Education
---------

2010-2014 (expected)
:   **PhD, Computer Science**; Awesome University (MyTown)

    *Thesis title: Deep Learning Approaches to the Self-Awesomeness
     Estimation Problem*

2007-2010
:   **BSc, Computer Science and Electrical Engineering**; University of
    HomeTown (HomeTown)

    *Minor: Awesomeology*

Experience
----------

**Your Most Recent Work Experience:**

Short text containing the type of work done, results obtained,
lessons learned and other remarks. Can also include lists and
links:

* First item

* Item with [link](http://www.example.com). Links will work both in
  the html and pdf versions.

**That Other Job You Had**

Also with a short description.

Technical Experience
--------------------

My Cool Side Project
:   For items which don't have a clear time ordering, a definition
    list can be used to have named items.

    * These items can also contain lists, but you need to mind the
      indentation levels in the markdown source.
    * Second item.

Open Source
:   List open source contributions here, perhaps placing emphasis on
    the project names, for example the **Linux Kernel**, where you
    implemented multithreading over a long weekend, or **node.js**
    (with [link](http://nodejs.org)) which was actually totally
    your idea...

Programming Languages
:   **first-lang:** Here, we have an itemization, where we only want
    to add descriptions to the first few items, but still want to
    mention some others together at the end. A format that works well
    here is a description list where the first few items have their
    first word emphasized, and the last item contains the final few
    emphasized terms. Notice the reasonably nice page break in the pdf
    version, which wouldn't happen if we generated the pdf via html.

:   **second-lang:** Description of your experience with second-lang,
    perhaps again including a [link] [ref], this time placing the url
    reference elsewhere in the document to reduce clutter (see source
    file). 

:   **obscure-but-impressive-lang:** We both know this one's pushing
    it.

:   Basic knowledge of **C**, **x86 assembly**, **forth**, **Common Lisp**

[ref]: https://github.com/githubuser/superlongprojectname

Extra Section, Call it Whatever You Want
----------------------------------------

* Human Languages:

     * English (native speaker)
     * ???
     * This is what a nested list looks like.

* Random tidbit

* Other sort of impressive-sounding thing you did`}</ReactMarkdown>
          </Frame>
        )}
      </Box>
    </Box>
  );
}

export default ResumeBuilder;
