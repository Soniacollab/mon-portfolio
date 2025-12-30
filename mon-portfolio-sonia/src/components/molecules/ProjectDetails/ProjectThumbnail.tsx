import React from "react";

import { asset } from "../../../utils/asset";
import { API_BASE } from "../../../constants/api";

interface Props {
  image?: string;
  title?: string;
}

const ProjectThumbnail: React.FC<Props> = ({ image, title }) => {
  const src = image ? (image.startsWith("http") ? image : asset(`${API_BASE}${image}`)) : asset("/placeholder.jpg");
  return (
    <div className="w-full md:w-56 flex-shrink-0 rounded-lg overflow-hidden border border-white/6 shadow-md">
      <img src={src} alt={title} className="w-full h-48 md:h-56 object-cover" />
    </div>
  );
};

export default ProjectThumbnail;
