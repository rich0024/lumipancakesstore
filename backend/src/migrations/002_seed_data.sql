-- Insert sample photocards data
INSERT INTO photocards (name, description, price, image, group_name, member, album, set_name, age, rarity, category) VALUES
('BTS - Jungkook Photocard', 'Official BTS Jungkook photocard from Proof album', 12.99, '/images/placeholder.svg', 'BTS', 'Jungkook', 'Proof', 'Proof Standard', '2022', 'Album', 'bts'),
('NewJeans - Hanni Polaroid', 'Limited edition Hanni polaroid from Get Up era', 18.99, '/images/placeholder.svg', 'NewJeans', 'Hanni', 'Get Up', 'Get Up Limited', '2023', 'Preorder Benefit', 'newjeans'),
('LE SSERAFIM - Chaewon Photocard', 'Chaewon photocard from UNFORGIVEN album', 14.99, '/images/placeholder.svg', 'LE SSERAFIM', 'Chaewon', 'UNFORGIVEN', 'UNFORGIVEN Standard', '2023', 'Album', 'lesserafim'),
('aespa - Winter Polaroid', 'Exclusive Winter polaroid from MY WORLD', 22.99, '/images/placeholder.svg', 'aespa', 'Winter', 'MY WORLD', 'MY WORLD Special', '2023', 'Lucky Draw', 'aespa'),
('TWICE - Sana Photocard', 'Sana photocard from READY TO BE album', 11.99, '/images/placeholder.svg', 'TWICE', 'Sana', 'READY TO BE', 'READY TO BE Standard', '2023', 'Album', 'twice'),
('ITZY - Yeji Polaroid', 'Limited Yeji polaroid from KILL MY DOUBT', 19.99, '/images/placeholder.svg', 'ITZY', 'Yeji', 'KILL MY DOUBT', 'KILL MY DOUBT Limited', '2023', 'Preorder Benefit', 'itzy'),
('Stray Kids - Felix Photocard', 'Felix photocard from 5-STAR album', 13.99, '/images/placeholder.svg', 'Stray Kids', 'Felix', '5-STAR', '5-STAR Standard', '2023', 'Album', 'straykids'),
('IVE - Wonyoung Polaroid', 'Exclusive Wonyoung polaroid from I''VE MINE', 21.99, '/images/placeholder.svg', 'IVE', 'Wonyoung', 'I''VE MINE', 'I''VE MINE Special', '2023', 'Lucky Draw', 'ive')
ON CONFLICT DO NOTHING;

-- Insert sample prints data
INSERT INTO prints (name, description, price, image, quantity) VALUES
('BTS Group Photo Print', 'High-quality print of BTS group photo from Proof era', 15.99, '/images/placeholder.svg', 10),
('NewJeans Concept Print', 'Artistic print featuring NewJeans members in Get Up concept', 18.99, '/images/placeholder.svg', 8),
('LE SSERAFIM Performance Print', 'Dynamic performance shot of LE SSERAFIM from UNFORGIVEN era', 16.99, '/images/placeholder.svg', 12),
('aespa MY WORLD Print', 'Stunning print from aespa''s MY WORLD concept photos', 19.99, '/images/placeholder.svg', 6),
('TWICE Group Shot Print', 'Beautiful group photo of TWICE from READY TO BE era', 17.99, '/images/placeholder.svg', 9),
('ITZY Performance Print', 'High-energy performance shot from KILL MY DOUBT', 18.99, '/images/placeholder.svg', 7),
('Stray Kids Concert Print', 'Amazing concert moment from Stray Kids 5-STAR tour', 20.99, '/images/placeholder.svg', 5),
('IVE Concept Print', 'Elegant concept photo from I''VE MINE era', 19.99, '/images/placeholder.svg', 8)
ON CONFLICT DO NOTHING;
