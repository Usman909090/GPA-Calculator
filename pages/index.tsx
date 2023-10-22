import {
  Grid,
  Box,
  Flex,
  Center,
  Text,
  Tooltip,
  CopyButton,
  Divider,
  TextInput,
  NumberInput,
  Select,
  Button,
  CloseButton,
  em,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { FaCopy } from 'react-icons/fa';
import { useForm } from '@mantine/form';
import { useState } from 'react';

interface Course {
  courseName: string;
  courseGrade: string;
  creditHours: number;
}

const courses: { courses: Course[] } = {
  courses: [
    {
      courseName: '',
      courseGrade: '',
      creditHours: 1,
    },
  ],
};

export default function Home() {
  const [gpa, setGPA] = useState<number | null>(0.0);
  const [isTablet, setIsTablet] = useState<boolean | null>(false);
  const checkTablet = async () => {
    setIsTablet(await useMediaQuery(`(max-width: ${em(928)})`));
  };
  checkTablet();
  const form = useForm({
    initialValues: {
      courses: [
        { courseName: '', courseGrade: '', creditHours: 1 },
        { courseName: '', courseGrade: '', creditHours: 1 },
        { courseName: '', courseGrade: '', creditHours: 1 },
        { courseName: '', courseGrade: '', creditHours: 1 },
        { courseName: '', courseGrade: '', creditHours: 1 },
      ],
    },
  });

  const addCourseRow = () => {
    if (form.values.courses.length < 10) {
      form.setValues({
        courses: [
          ...form.values.courses,
          { courseName: '', courseGrade: '', creditHours: 1 },
        ],
      });
    }
  };

  const deleteCourseRow = (course2Delete: Course) => {
    if (form.values.courses.length === 1) {
      return;
    } else {
      const newForm = form.values.courses.filter(
        (course) => course !== course2Delete
      );

      form.setValues({
        courses: [...newForm],
      });
    }
  };

  const clearAll = () => {
    form.reset();
    setGPA(0.0);
  };

  const getGradePoints = (grade: string): number => {
    // Define the grade points for each grade here
    const gradePointsMap: { [key: string]: number } = {
      'A+': 4.0,
      A: 4.0,
      'A-': 3.7,
      'B+': 3.3,
      B: 3.0,
      'B-': 2.7,
      'C+': 2.3,
      C: 2.0,
      'C-': 1.7,
      'D+': 1.3,
      D: 1.0,
      F: 0.0,
      '-': 0.0,
    };

    return gradePointsMap[grade] || 0.0;
  };

  const calculateGPA = (): void => {
    const totalPoints = form.values.courses.reduce<number>(
      (accumulator, course) => {
        if (course.courseGrade === '-' || course.courseGrade === '') {
          return accumulator;
        }

        const gradePoints = getGradePoints(course.courseGrade);
        const creditHours = course.creditHours;
        return accumulator + gradePoints * creditHours;
      },
      0
    );

    const totalCreditHours = form.values.courses.reduce<number>(
      (accumulator, course) => {
        if (course.courseGrade === '-' || course.courseGrade === '') {
          return accumulator;
        }

        return accumulator + course.creditHours;
      },
      0
    );

    if (totalCreditHours === 0) {
      setGPA(null); // To prevent division by zero
    }

    setGPA(totalPoints / totalCreditHours);
  };

  return (
    <Grid h={'100%'} m={0} pl="20px" pt="20px" pr="20px" pb="40px">
      <Grid.Col
        sx={(theme) => ({
          boxShadow: theme.shadows.md,
          backgroundColor: '#f7f7f7',
          borderRight: '1px solid',
          borderColor: '#D9D9D9',
        })}
        sm={6}
      >
        <Box py={24} px={'16px'} w={{ base: '100%' }}>
          <Flex mb="12px" mr="20px" justify="space-between">
            <Text w="33%" fz="lg" fw={500} align="center">
              Courses
            </Text>
            <Text w="33%" fz="lg" fw={500} align="center">
              Grade
            </Text>
            <Text w="33%" fz="lg" fw={500} align="center">
              Credit Hours
            </Text>
          </Flex>

          {form?.values.courses?.map((course, index) => (
            <Flex key={index} mb="12px" justify="space-between" align="center">
              <TextInput
                w="33%"
                placeholder={`Course ${index + 1}`}
                label=""
                {...form.getInputProps(`courses.${index}.courseName`)}
              />

              <Select
                w="33%"
                data={[
                  'A+',
                  'A',
                  'A-',
                  'B+',
                  'B',
                  'B-',
                  'C+',
                  'C',
                  'C-',
                  'D+',
                  'D',
                  'F',
                  '-',
                ]}
                placeholder="-"
                label=""
                {...form.getInputProps(`courses.${index}.courseGrade`)}
              />

              <NumberInput
                w="33%"
                min={1}
                label=""
                {...form.getInputProps(`courses.${index}.creditHours`)}
              />
              <CloseButton
                onClick={() => deleteCourseRow(form.values.courses[index])}
                aria-label="Close modal"
              />
            </Flex>
          ))}
          <Divider
            mb="24px"
            color="#000000"
            mt="24px"
            style={{ borderTopWidth: '3px' }}
          />
          <Flex
            justify="flex-end"
            direction={isTablet ? 'column' : 'row'}
            gap={isTablet ? 'md' : '0'}
          >
            <Button
              disabled={!form?.isValid()}
              size="md"
              style={{ backgroundColor: 'black', color: 'white' }}
              onClick={calculateGPA}
              type="submit"
            >
              <Text>Calculate</Text>
            </Button>
            <Button
              disabled={!form?.isValid()}
              size="md"
              style={{
                backgroundColor: 'black',
                color: 'white',

                marginLeft: isTablet ? '0px' : '12px',
              }}
              type="button"
              onClick={addCourseRow}
            >
              <Text>Add more courses</Text>
            </Button>
            <Button
              disabled={!form?.isValid()}
              size="md"
              style={{
                backgroundColor: 'black',
                color: 'white',
                marginLeft: isTablet ? '0px' : '12px',
              }}
              type="button"
              onClick={clearAll}
            >
              <Text>Clear</Text>
            </Button>
          </Flex>
        </Box>
      </Grid.Col>

      <Grid.Col sm={6}>
        <Flex direction="row" justify="space-between" align="center">
          <Text fz="xl" align="left">
            Grade Point Average (GPA)
          </Text>
          <CopyButton value={gpa ? gpa.toFixed(2) : 'NaN'}>
            {({ copied, copy }) => (
              <Tooltip
                label={'Copied'}
                opened={copied}
                withArrow
                position="right"
                color="green"
              >
                <Box
                  sx={(theme) => ({
                    borderRadius: theme.radius.sm,
                    borderColor: 'black',
                    cursor: 'pointer',
                  })}
                >
                  <FaCopy onClick={copy} cursor="pointer" color="lightgray" />
                </Box>
              </Tooltip>
            )}
          </CopyButton>
        </Flex>
        <Box
          sx={(theme) => ({
            display: 'block',
            backgroundColor: '#E9ECEF',
            borderRadius: theme.radius.sm,
            cursor: 'pointer',

            '&:hover': {
              backgroundColor:
                theme.colorScheme === 'dark'
                  ? theme.colors.dark[8]
                  : theme.colors.gray[3],
            },
          })}
        >
          <Flex direction="row" justify="center" align="center">
            <Center maw={200} h={50}>
              <Text fz="xl" color="#202123">
                {`Your GPA is: `}
                {gpa ? gpa.toFixed(2) : ''}
              </Text>
            </Center>
          </Flex>
        </Box>
      </Grid.Col>
    </Grid>
  );
}
