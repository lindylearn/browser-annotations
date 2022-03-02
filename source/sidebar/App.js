import React, { useEffect, useState } from 'react';

import AnnotationsList from './components/AnnotationsList';
import { getAnnotations } from './common/api';
import { createDraftAnnotation } from '../common/getAnnotations';

export default function App({ url }) {
	const [annotations, setAnnotations] = useState([]);

	window.onmessage = function ({ data }) {
		if (data.event === 'createHighlight') {
			setAnnotations([...annotations, data.annotation]);
		} else if (data.event === 'anchoredAnnotations') {
			setAnnotations(data.annotations);
		} else if (data.event === 'changedDisplayOffset') {
			const updatedAnnotations = annotations.map((a) => ({
				...a,
				displayOffset: data.offsetById[a.id],
			}));
			setAnnotations(updatedAnnotations);
		}
	};

	useEffect(async () => {
		let { annotations } = await getAnnotations(url);
		window.top.postMessage(
			{ event: 'anchorAnnotations', annotations },
			'*'
		);
	}, []);

	// console.log(annotations);

	return (
		<div>
			<div>
				<AnnotationsList
					url={url}
					annotations={annotations}
					setAnnotations={setAnnotations}
					// upvotedAnnotations={upvotedAnnotations}
					// upvoteAnnotation={upvoteAnnotation}
				/>
			</div>
		</div>
	);
}
