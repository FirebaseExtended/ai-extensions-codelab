/**
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const mockReviews = [
	"This t-shirt is amazing! The fabric is soft and comfortable, and the design is eye-catching. I've received so many compliments wearing it. The fit is perfect, and it's true to size. I would highly recommend it to anyone looking for a stylish and comfortable t-shirt.",
	"I love this t-shirt! The print quality is fantastic, and the colors are vibrant. It's a great addition to my wardrobe and has become one of my favorite shirts. The material is breathable and perfect for warm weather. The sizing chart was accurate, so it fits just right. Definitely worth every penny!",
	"Unfortunately, this t-shirt didn't meet my expectations. The fabric feels cheap, and after just one wash, the print started to fade. The sizing is also off, and it's smaller than expected. I'm quite disappointed with the overall quality of the product.",
	"What a unique t-shirt design! I adore the creativity behind it. The cotton fabric feels soft and cozy, making it a pleasure to wear. I'm impressed with the attention to detail in the artwork. This shirt is a conversation starter, and I love sharing the story behind it with people.",
	"I've purchased multiple t-shirts from this brand, and this one is no exception to the high-quality standards. The print is sharp and clear, and the colors are vibrant. The shirt fits perfectly and doesn't shrink after washing. I'm a loyal customer and will continue to buy more!",
	"The design on this t-shirt is so cool! The shirt itself is made of high-quality material and feels durable. However, the sizing is a bit inconsistent. I ordered a medium, and it's too tight around the shoulders but loose around the waist. It's a shame because otherwise, I'd love to wear it often.",
	"This t-shirt is a total game-changer! The fabric is incredibly soft, and it fits like a dream. I've washed it multiple times, and the colors haven't faded at all. The design is unique and eye-catching, making me stand out in the best way possible.",
	"I purchased this t-shirt as a gift for my friend, and she absolutely loves it! The fit is perfect for her, and she says it's one of the comfiest shirts she owns. The design is quirky and fun, which matches her personality perfectly. It was a great choice!",
	"I'm not too thrilled with this t-shirt. The print quality is not up to par, and it looks a bit pixelated up close. Additionally, the fabric isn't as soft as I'd hoped, and it's a bit scratchy on the skin. I expected better considering the price.",
	"This t-shirt is fantastic! The design is unique, and the material is top-notch. It's super comfortable and lightweight, making it perfect for hot summer days. I've received so many compliments on it, and I'm thinking of getting another one in a different design!",
	"I had high hopes for this t-shirt, but unfortunately, it fell short. The print started cracking after just a couple of wears, and the shirt's color faded drastically after the first wash. I wish it had better quality because I loved the design.",
	"I absolutely adore this t-shirt! The fit is perfect, and the fabric is so soft. The artwork is stunning, and I appreciate the environmentally friendly printing process. I'll definitely be purchasing more products from this brand in the future.",
	"I was skeptical about buying this t-shirt, but I'm pleasantly surprised! The fabric is incredibly soft and comfortable. The size is just right for me, and the design is quite appealing. I'm really happy with this purchase.",
	"I'm a bit disappointed with this t-shirt. The colors in the picture looked vibrant, but in reality, they are dull and faded. The material is also thinner than I expected, and it doesn't feel very durable. Not the best purchase I've made.",
	"This t-shirt is a hit! The design is edgy and cool, and the fit is perfect. The fabric feels high-quality and breathable. It's definitely one of my go-to shirts for casual outings. I highly recommend it to anyone looking for something unique.",
	"I had to return this t-shirt because it arrived with a small tear in the fabric. The print quality was also subpar with some parts looking blurry. It's a shame because I really liked the design. Hopefully, the replacement will be in better condition.",
	"Wow, this t-shirt exceeded my expectations! The print looks even better in person, and the fabric is soft and comfortable. The attention to detail is impressive, and it feels like a premium product. I can't wait to show it off to my friends!",
	"The t-shirt I received had a slight defect on the print, but the customer service was excellent, and they promptly sent me a replacement. The new one is perfect, and I'm extremely satisfied with my purchase. The design is fantastic!",
	"I bought this t-shirt as a gift for my brother, and he loves it! The design is right up his alley, and the fit is great. The fabric is soft and feels high-quality. It was a perfect present for him!",
	"The t-shirt design is beautiful, but the size chart is misleading. I followed the measurements, but the shirt I received is way too big for me. Now I have to go through the hassle of exchanging it for a smaller size.",
	"I ordered this t-shirt for a themed party, and it was a huge hit! The print is clear and detailed, and the shirt itself is comfortable to wear. It's definitely one of the best purchases I've made for a costume event.",
	"This t-shirt is simply awesome! The colors are vibrant, and the fabric is soft and stretchy. The fit is flattering, and I love how it accentuates my figure. I feel great wearing it, and I've already received compliments from strangers!",
	"I'm not impressed with this t-shirt. The material is thin and feels cheap. The print is okay, but it lacks the vibrancy I was expecting. It's just a mediocre shirt, not worth the price.",
	"I've been wearing this t-shirt regularly for months now, and it's holding up really well. The fabric hasn't shown any signs of wear, and the print looks as good as new. I'm extremely satisfied with this purchase.",
	"I bought this t-shirt to support a cause, and I couldn't be happier with my decision. The design is not only beautiful but also meaningful. The fit is perfect, and the fabric feels great. I love wearing it and spreading awareness.",
	"The t-shirt arrived with a small stain on the sleeve, which was disappointing. However, the customer service was quick to resolve the issue and sent me a new one. The replacement is perfect, and I appreciate their responsiveness.",
	"I bought this t-shirt for my son, and he loves it! The design is fun, and the fabric is comfortable. It's his new favorite shirt, and he insists on wearing it all the time.",
	"This t-shirt is a conversation starter! I've had people stop me on the street to ask where I got it. The design is clever, and the quality is top-notch. I highly recommend it for anyone who wants to stand out.",
	"I wish I could give this t-shirt a higher rating, but the sizing is a major issue. I followed the size guide, but the shirt is way too tight around the chest and shoulders. It's a shame because the design is awesome.",
	"I bought this t-shirt for a friend's birthday, and he absolutely loved it! The design is right up his alley, and he said it's one of the most comfortable shirts he owns. It's a great gift option!",
	"I ordered two t-shirts, and one of them arrived with a small hole near the hem. The other shirt is fine, and the design is great. I'll have to sew up the hole, but it's still an inconvenience.",
	"This t-shirt is perfect for outdoor activities. The fabric is lightweight and breathable, making it comfortable to wear during hikes or workouts. The design is also catchy, and I've received compliments on it.",
	"I was a bit hesitant to buy this t-shirt, but I'm glad I did! The fabric is super soft, and the fit is just right. The design is fun, and I always get positive comments when I wear it.",
	"I ordered this t-shirt for a themed event, and it was a big hit! The print quality is excellent, and the colors are vibrant. It's comfortable to wear, and I'm really satisfied with this purchase.",
	"I was disappointed with the size of this t-shirt. It's much smaller than the measurements provided in the size chart. I recommend ordering a size up to ensure a proper fit.",
	"I love this t-shirt! The design is funky and cool, and the fabric is soft and cozy. It's perfect for casual outings, and I've received several compliments while wearing it.",
	"The t-shirt arrived with a small defect on the sleeve stitching, but the overall quality is still good. I contacted customer support, and they offered a partial refund to cover the cost of repair.",
	"I'm impressed with the eco-friendly packaging this t-shirt came in. The shirt itself is soft and comfortable, and the design is trendy. I appreciate brands that care about sustainability.",
	"I was skeptical about the sizing, but the t-shirt fits perfectly! The fabric feels great, and the colors are vibrant. I'm very happy with this purchase.",
	"This t-shirt is an attention-grabber! I love the unique design, and it looks even better in person. The fit is comfortable, and the fabric is high-quality.",
	"I ordered this t-shirt in two different colors, but one of them had a minor color discrepancy. It's not too noticeable, but it bothers me a bit.",
	"The t-shirt is soft and comfy, but the print started peeling after just a few washes. It's a shame because I really liked the design.",
	"I'm really pleased with this t-shirt. The fabric is soft and breathable, and the design is artistic and beautiful. I wear it often and always get compliments.",
	"The t-shirt arrived with a loose thread, but I trimmed it, and it looks fine now. The design is awesome, and I've already recommended it to friends.",
	"This t-shirt fits perfectly, and the fabric is soft and cozy. The design is hilarious, and I've worn it to parties with great reactions.",
];

// Ensure there are no duplicate reviews in the array
export default [...new Set(mockReviews)];
