
import dynamic from 'next/dynamic';
import { ReadonlyContext } from '../../src/contexts';

const DocumentEditorPage = dynamic(() => import('../../src/pages/DocumentPage'), {
    ssr: false,
})


export const aiComments = [
    {
        "id": "1683123862559",
        "range": {
            "index": 588,
            "length": 750
        },
        "top": 399.6590881347656,
        "bottom": 598.7215576171875,
        "left": 297.585205078125,
        "right": 1017.585205078125,
        "selectedText": "Selected Project Experience\t\nOperations Improvement Project\nDrove redevelopment of internal tracking system in use by 125 employees, resulting in 20+ new features, reduction of 20% in save/load time and 15% operation time\nRefined outsourcing strategy, resulting in increased offshore headcount from 12 to 95 employees\nReduced development costs by 25 percent by creating a plan to merge related products into one, more streamlined product.\nManaged a process re-engineering project to improve and consolidate end-to-end service processes; restructured communication flow among 10 departments, and cut down reporting time by 75%\nLaunch of New iPhone App\nLed application design sessions with client teams on 20+ projects to develop technical requirements",
        "width": "300px",
        "isOpen": false,
        "messageHistory": [
            {
                "message": "Write me a new bullet point to show case how I saved engineers 10 hours weekly",
                "sentTime": "just now",
                "sender": "You",
                "direction": "outgoing",
                "position": "last"
            },
            {
                "message": "Generated answer: Developed and implemented new workflow processes, resulting in the reduction of engineering work time by 10 hours per week.",
                "sentTime": "just now",
                "sender": "AiDox",
                "direction": "incoming",
                "position": "last"
            }
        ]
    },
    {
        "id": "1683123929491",
        "range": {
            "index": 2024,
            "length": 83
        },
        "top": 897.8550872802734,
        "bottom": 727.8551025390625,
        "left": 297.585205078125,
        "right": 835.8096313476562,
        "selectedText": "Bachelor of Engineering, Major in Computer Science; Minor in Mathematics\t2007-2011\n",
        "width": "300px",
        "isOpen": false,
        "messageHistory": [
            {
                "message": "Write me a bullet point showing skills I picked up from courses like Statistics, Object oriented programming",
                "sentTime": "just now",
                "sender": "You",
                "direction": "outgoing",
                "position": "last"
            },
            {
                "message": "Generated answer: \n- Statistical analysis skills developed through courses like Statistics\n- Proficiency in Object-Oriented Programming gained through courses in Computer Science",
                "sentTime": "just now",
                "sender": "AiDox",
                "direction": "incoming",
                "position": "last"
            }
        ]
    }
]

export const documentDelta = [
    {
        "attributes": {
            "background": "transparent",
            "bold": true
        },
        "insert": "John Smith"
    },
    {
        "attributes": {
            "align": "center"
        },
        "insert": "\n"
    },
    {
        "attributes": {
            "background": "transparent",
            "bold": true
        },
        "insert": "Technical Program Manager"
    },
    {
        "attributes": {
            "align": "center"
        },
        "insert": "\n"
    },
    {
        "attributes": {
            "background": "transparent"
        },
        "insert": "New York City, NY 10000 first.last@resumeworded.com + 1 (212) 123-4567"
    },
    {
        "attributes": {
            "align": "center"
        },
        "insert": "\n"
    },
    {
        "insert": "\n"
    },
    {
        "attributes": {
            "background": "transparent",
            "bold": true
        },
        "insert": "PROFESSIONAL EXPERIENCE"
    },
    {
        "insert": "\n\n"
    },
    {
        "attributes": {
            "background": "transparent",
            "bold": true
        },
        "insert": "RESUME WORDED\tSan Francisco, CA and New York, NY"
    },
    {
        "insert": "\n"
    },
    {
        "attributes": {
            "background": "transparent",
            "bold": true
        },
        "insert": "Technical Program Manager\t2014-Present"
    },
    {
        "insert": "\n"
    },
    {
        "attributes": {
            "background": "transparent"
        },
        "insert": "Led multi-disciplinary 7 person team to design, develop, and launch online e-commerce store; prioritized and resolved 45+ new features and bug fixes"
    },
    {
        "attributes": {
            "list": "bullet"
        },
        "insert": "\n"
    },
    {
        "attributes": {
            "background": "transparent"
        },
        "insert": "Promoted within 12 months due to strong performance and organizational impact (one year ahead of schedule)"
    },
    {
        "attributes": {
            "list": "bullet"
        },
        "insert": "\n"
    },
    {
        "attributes": {
            "background": "transparent"
        },
        "insert": "Developed strategic insights across 5 product teams, including revenue, marketing and operations departments"
    },
    {
        "attributes": {
            "list": "bullet"
        },
        "insert": "\n"
    },
    {
        "insert": "\n"
    },
    {
        "attributes": {
            "commentLink": {
                "id": "1683123862559",
                "color": "#e0ffff"
            },
            "italic": true,
            "background": "transparent",
            "bold": true
        },
        "insert": "Selected Project Experience"
    },
    {
        "attributes": {
            "color": "",
            "commentLink": {
                "id": "1683123862559",
                "color": "#e0ffff"
            },
            "background": "transparent",
            "bold": true
        },
        "insert": "\t"
    },
    {
        "insert": "\n"
    },
    {
        "attributes": {
            "color": "",
            "background": "transparent",
            "commentLink": {
                "id": "1683123862559",
                "color": "#e0ffff"
            }
        },
        "insert": "Operations Improvement Project"
    },
    {
        "attributes": {
            "list": "bullet"
        },
        "insert": "\n"
    },
    {
        "attributes": {
            "color": "",
            "background": "transparent",
            "commentLink": {
                "id": "1683123862559",
                "color": "#e0ffff"
            }
        },
        "insert": "Drove redevelopment of internal tracking system in use by 125 employees, resulting in 20+ new features, reduction of 20% in save/load time and 15% operation time"
    },
    {
        "attributes": {
            "list": "bullet"
        },
        "insert": "\n"
    },
    {
        "attributes": {
            "color": "",
            "background": "transparent",
            "commentLink": {
                "id": "1683123862559",
                "color": "#e0ffff"
            }
        },
        "insert": "Refined outsourcing strategy, resulting in increased offshore headcount from 12 to 95 employees"
    },
    {
        "attributes": {
            "list": "bullet"
        },
        "insert": "\n"
    },
    {
        "attributes": {
            "color": "",
            "background": "transparent",
            "commentLink": {
                "id": "1683123862559",
                "color": "#e0ffff"
            }
        },
        "insert": "Reduced development costs by 25 percent by creating a plan to merge related products into one, more streamlined product."
    },
    {
        "attributes": {
            "list": "bullet"
        },
        "insert": "\n"
    },
    {
        "attributes": {
            "color": "",
            "background": "transparent",
            "commentLink": {
                "id": "1683123862559",
                "color": "#e0ffff"
            }
        },
        "insert": "Managed a process re-engineering project to improve and consolidate end-to-end service processes; restructured communication flow among 10 departments, and cut down reporting time by 75%"
    },
    {
        "attributes": {
            "list": "bullet"
        },
        "insert": "\n"
    },
    {
        "attributes": {
            "color": "",
            "background": "transparent",
            "commentLink": {
                "id": "1683123862559",
                "color": "#e0ffff"
            }
        },
        "insert": "Launch of New iPhone App"
    },
    {
        "attributes": {
            "list": "bullet"
        },
        "insert": "\n"
    },
    {
        "attributes": {
            "color": "",
            "background": "transparent",
            "commentLink": {
                "id": "1683123862559",
                "color": "#e0ffff"
            }
        },
        "insert": "Led application design sessions with client teams on 20+ projects to develop technical requirements"
    },
    {
        "attributes": {
            "list": "bullet"
        },
        "insert": "\n"
    },
    {
        "insert": "\n"
    },
    {
        "attributes": {
            "background": "transparent",
            "bold": true
        },
        "insert": "GROWTHSI New York, NY"
    },
    {
        "insert": "\n"
    },
    {
        "attributes": {
            "background": "transparent",
            "bold": true
        },
        "insert": "Product Manager\t2012-2013"
    },
    {
        "insert": "\n"
    },
    {
        "attributes": {
            "background": "transparent"
        },
        "insert": "Spearheaded a cross-functional team (Technology, Business Development, Management) to implement new ERP system; successful adoption accelerated revenue growth by 25% in 1 year"
    },
    {
        "attributes": {
            "list": "bullet"
        },
        "insert": "\n"
    },
    {
        "attributes": {
            "background": "transparent"
        },
        "insert": "Improved sales efficiency by leading sustainable adoption of a new CRM tool among 150 sales persons in 6 months; redesigned key sales support workflows"
    },
    {
        "attributes": {
            "list": "bullet"
        },
        "insert": "\n"
    },
    {
        "attributes": {
            "background": "transparent"
        },
        "insert": "Designed training and peer-mentoring programs for D&I events targeted at C-level executives; led training and awareness initiatives that were attended by over 10,000 employees in 2 years"
    },
    {
        "attributes": {
            "list": "bullet"
        },
        "insert": "\n"
    },
    {
        "insert": "\n"
    },
    {
        "attributes": {
            "background": "transparent",
            "bold": true
        },
        "insert": "EDUCATION"
    },
    {
        "insert": "\n\n"
    },
    {
        "attributes": {
            "background": "transparent",
            "bold": true
        },
        "insert": "GROWTHSI\tSan Francisco, CA"
    },
    {
        "insert": "\n"
    },
    {
        "attributes": {
            "italic": true,
            "background": "transparent",
            "bold": true
        },
        "insert": "[Second Degree or Certification]"
    },
    {
        "attributes": {
            "background": "transparent",
            "bold": true
        },
        "insert": "\t2011-2012"
    },
    {
        "insert": "\n\n"
    },
    {
        "attributes": {
            "background": "transparent",
            "bold": true
        },
        "insert": "RESUME WORDED UNIVERSITY\tNew York, NY"
    },
    {
        "insert": "\n"
    },
    {
        "attributes": {
            "commentLink": {
                "id": "1683123929491",
                "color": "#ff0000"
            },
            "italic": true,
            "background": "transparent",
            "bold": true
        },
        "insert": "Bachelor of Engineering, Major in Computer Science; Minor in Mathematics"
    },
    {
        "attributes": {
            "color": "",
            "commentLink": {
                "id": "1683123929491",
                "color": "#ff0000"
            },
            "background": "transparent",
            "bold": true
        },
        "insert": "\t2007-2011"
    },
    {
        "insert": "\n\n"
    },
    {
        "attributes": {
            "background": "transparent",
            "bold": true
        },
        "insert": "ADDITIONAL INFORMATION"
    },
    {
        "insert": "\n"
    },
    {
        "attributes": {
            "background": "transparent"
        },
        "insert": "Program Management: SDLC (Software Development Life Cycle), Resource Planning, Jira, MS Project"
    },
    {
        "attributes": {
            "list": "bullet"
        },
        "insert": "\n"
    },
    {
        "attributes": {
            "background": "transparent"
        },
        "insert": "Technical Skills: Python, R, Microsoft SQL Server, Amazon Web Services (AWS), PRINCE2"
    },
    {
        "attributes": {
            "list": "bullet"
        },
        "insert": "\n"
    },
    {
        "attributes": {
            "background": "transparent"
        },
        "insert": "Certifications: Data Science Bootcamp (2016), Passed Resume Worded examinations"
    },
    {
        "attributes": {
            "list": "bullet"
        },
        "insert": "\n"
    },
    {
        "insert": "\n"
    }
]


export default function App() {
    return (
        <ReadonlyContext.Provider value={{ readonly: true, showComments: true }}>
            <DocumentEditorPage hideNav documentId='test' documentName={"John Smith Product Manager Resume"} aiComments={aiComments} documentContent={documentDelta} />
        </ReadonlyContext.Provider>
    );
}