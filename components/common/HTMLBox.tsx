import React, {FC} from 'react';
import ReactHtmlParser from 'html-react-parser';

type HtmlBoxProps = {
  children: string;
};

const HtmlBox: FC<HtmlBoxProps> = ({children}) => (
  <>{ReactHtmlParser(children)}</>
);

export default HtmlBox;
