import React, { useRef, useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  IconButton,
  Stack,
  Collapse,
  Icon,
  Link,
  TabList,
  Tab,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import NextLink from "next/link";
import styles from "./horizontalNav.module.css";
import animationData from "../../../public/help.json";
import Lottie from "react-lottie";
import { HamburgerIcon, CloseIcon, ChevronDownIcon } from "@chakra-ui/icons";
import DocumentTitle from "../documents/editor/DocumentTitle";
import { BsArrowLeft } from "react-icons/bs";
import { motion } from "framer-motion";

export default function WithSubnavigation(props: any) {
  const { isOpen, onToggle } = useDisclosure();

  const ref = useRef(null);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { height } = entry.contentRect;
        props.onHeightChange(height);
      }
    });
    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref?.current);
      }
    };
  }, [props.onHeightChange]);

  return (
    <Box ref={ref}>
      <Flex
        bg={useColorModeValue("white", "gray.800")}
        color={useColorModeValue("gray.600", "white")}
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        border={"0px solid #e5e7eb"}
        align={"center"}
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
          {/* <Text
              textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
              fontFamily={'heading'}
              color={useColorModeValue('gray.800', 'white')}>
              <BsArrowLeft size={25}/>
            </Text> */}

          <Flex display={{ base: "none", md: "flex" }} alignItems="center">
            <DesktopNav
              documentName={props.documentName}
              setDocumentName={props.setDocumentName}
              lastModified={props.lastModified}
            />
          </Flex>
          <Flex alignItems="center" justifyContent="center" margin="auto">
            <TabListComponent />
          </Flex>
          <LottieAnimation />
        </Flex>
      </Flex>
      <CustomToolbar />

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
}

const LottieAnimation = () => {
  const davidEmail = "tbilisimaximus@gmail.com";
  const subject = "Resume Help";
  const body =
    "Dear David,\n\nI need help with my resume.\n\nBest regards,\n[Your Name]";

  const handleEmailClick = () => {
    const mailtoLink = `mailto:${davidEmail}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    initialSegment: [0, 64],
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const animationRef = useRef(null);

  const [currentLoop, setLoopCounter] = useState(0);

  useEffect(() => {
    if (animationRef.current) {
      const anim = animationRef.current.anim;
      anim.addEventListener("loopComplete", handleLoopComplete);
    }

    return () => {
      if (animationRef.current) {
        const anim = animationRef.current.anim;
        anim.removeEventListener("loopComplete", handleLoopComplete);
      }
    };
  }, []);

  const handleLoopComplete = () => {
    if (animationRef.current) {
      const anim = animationRef.current.anim;

      if (currentLoop <= 4) {
        // Subsequent loops
        anim.playSegments([64, 91], true);
      }

      // Increment the loop counter
      setLoopCounter(currentLoop + 1);
    }
  };

  console.log(animationData, "animationdata");

  return (
    <Flex onClick={handleEmailClick} style={{ cursor: "pointer", border: "2px solid #000000", borderRadius: '8px'}}>
      <div
        style={{
          width: "55px",
          height: "65px",
          marginRight: "0px",
          position: "relative",
        }}
      >
        <Lottie ref={animationRef} options={defaultOptions} speed={0.5} />
      </div>
      <div
        className={styles["text-container"]}
        style={{
          width: "50%",
          opacity: 1,
          transition: "opacity 0.3s ease",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Email David!</Text>
      </div>
    </Flex>
  );
};

const TabListComponent = () => {
  return (
    <TabList>
      <Tab>Mini Chats</Tab>
      <Tab>GPT-4</Tab>
    </TabList>
  );
};
const CustomToolbar = () => (
  <div
    id="toolbar"
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "1px solid #e5e7eb",
    }}
  >
    <select
      className="ql-header"
      defaultValue={""}
      onChange={(e) => e.persist()}
    >
      <option value="1" />
      <option value="2" />
      <option selected />
    </select>
    <button className="ql-bold" />
    <button className="ql-italic" />
    <button className="ql-undo" /> {/* Add undo button */}
    <button className="ql-redo" /> {/* Add redo button */}
  </div>
);

interface desktopNavProps {
  documentName?: string;
  setDocumentName?: any;
  lastModified?: Date;
}

const DesktopNav = (props: desktopNavProps) => {
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const linkHoverColor = useColorModeValue("gray.800", "white");
  const popoverContentBgColor = useColorModeValue("white", "gray.800");

  return (
    <>
      <Flex flex={{ base: 3 }} justify={{ base: "center", md: "start" }} mr={6}>
        <Link as={NextLink} href="/files">
          <Text
            textAlign={useBreakpointValue({ base: "center", md: "left" })}
            fontFamily={"heading"}
            color={useColorModeValue("gray.800", "white")}
            cursor={"pointer"}
          >
            <BsArrowLeft size={25} className={styles["back-btn"]} />
          </Text>
        </Link>
      </Flex>

      <Stack direction={"column"} spacing={0}>
        <DocumentTitle
          documentName={props.documentName}
          onDocumentNameChange={(newName) => props.setDocumentName(newName)}
        />
        {props.lastModified && (
          <Text
            fontSize="11"
            color="gray"
            fontStyle="italic"
            marginBottom="0.1rem"
            marginTop="15px"
          >
            Modified: {props.lastModified.toLocaleTimeString()}
          </Text>
        )}
      </Stack>
    </>
  );
};

const MobileNav = () => {
  return (
    <Stack
      bg={useColorModeValue("white", "gray.800")}
      p={4}
      display={{ md: "none" }}
    >
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={Link}
        href={href ?? "#"}
        justify={"space-between"}
        align={"center"}
        _hover={{
          textDecoration: "none",
        }}
      >
        <Text
          fontWeight={600}
          color={useColorModeValue("gray.600", "gray.200")}
        >
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={"all .25s ease-in-out"}
            transform={isOpen ? "rotate(180deg)" : ""}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: "0!important" }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={"solid"}
          borderColor={useColorModeValue("gray.200", "gray.700")}
          align={"start"}
        >
          {children &&
            children.map((child) => (
              <Link key={child.label} py={2} href={child.href}>
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: "Inspiration",
    children: [
      {
        label: "Explore Design Work",
        subLabel: "Trending Design to inspire you",
        href: "#",
      },
      {
        label: "New & Noteworthy",
        subLabel: "Up-and-coming Designers",
        href: "#",
      },
    ],
  },
  {
    label: "Find Work",
    children: [
      {
        label: "Job Board",
        subLabel: "Find your dream design job",
        href: "#",
      },
      {
        label: "Freelance Projects",
        subLabel: "An exclusive list for contract work",
        href: "#",
      },
    ],
  },
  {
    label: "Learn Design",
    href: "#",
  },
  {
    label: "Hire Designers",
    href: "#",
  },
];
