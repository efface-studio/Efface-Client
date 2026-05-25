# Changelog

## [1.1.0](https://github.com/efface-studio/Efface-Client/compare/v1.0.0...v1.1.0) (2026-05-25)


### Features

* **apply/email:** redesign admin + client emails to match the site ([#23](https://github.com/efface-studio/Efface-Client/issues/23)) ([4412fe8](https://github.com/efface-studio/Efface-Client/commit/4412fe8d333a4f6af77c9b3f9250a886a86b53c8))
* **apply:** redesign form into 3 numbered sections ([#27](https://github.com/efface-studio/Efface-Client/issues/27)) ([3c3e808](https://github.com/efface-studio/Efface-Client/commit/3c3e80861d41933069416a5c0244a7b7d7b5fee2))
* **apply:** redesign success state with timeline + check icon + CTA ([#22](https://github.com/efface-studio/Efface-Client/issues/22)) ([fb1799d](https://github.com/efface-studio/Efface-Client/commit/fb1799d4d83b59059554ad44402569097e246753))
* **apply:** redesign verified-email state — card + check + change ([#26](https://github.com/efface-studio/Efface-Client/issues/26)) ([486494e](https://github.com/efface-studio/Efface-Client/commit/486494e7c3f8f889ea8b7722f7ba201654db0f69))
* **apply:** smaller subhead + smoother send-code button transition ([#30](https://github.com/efface-studio/Efface-Client/issues/30)) ([9298043](https://github.com/efface-studio/Efface-Client/commit/9298043d999f4092cf4f0ad9f1e55751bff66390))
* **estimator+apply:** USD/$ for EN, 12 add-ons, apply-page prefill ([#28](https://github.com/efface-studio/Efface-Client/issues/28)) ([541acef](https://github.com/efface-studio/Efface-Client/commit/541acefd115e91443c21704d4b20b38265bd6157))
* Hero social proof 영역에 실제 클라이언트 로고 적용 ([f9f7cd1](https://github.com/efface-studio/Efface-Client/commit/f9f7cd1e67b8be1d01a809a299fb1f8e50c20669))
* **hero:** subtle CSS rise-in instead of framer-motion entry fades ([#38](https://github.com/efface-studio/Efface-Client/issues/38)) ([2215c7e](https://github.com/efface-studio/Efface-Client/commit/2215c7e275138a55e6919094f7748c9db1588a5d))
* LinkedIn link on founder pill + email OTP gate on apply form ([#16](https://github.com/efface-studio/Efface-Client/issues/16)) ([1328911](https://github.com/efface-studio/Efface-Client/commit/13289113e4d219be184ce5875531ab3235420256))
* **motion:** scroll-driven parallax + punchier reveals ([#33](https://github.com/efface-studio/Efface-Client/issues/33)) ([c82ccfd](https://github.com/efface-studio/Efface-Client/commit/c82ccfd38b123d6ec3fcd2fd683e4833eb38c797))
* OG/Twitter 카드 메타데이터 + 배너 이미지 추가 ([f94d723](https://github.com/efface-studio/Efface-Client/commit/f94d7235fb1f7a3de73baff0b594bb32ce373bfd))
* redesign footer email block with primary/secondary hierarchy ([#15](https://github.com/efface-studio/Efface-Client/issues/15)) ([6b95129](https://github.com/efface-studio/Efface-Client/commit/6b95129045ec11f0132472c4d381aa72089e3781))
* SMS phone verification, lower pricing, efface case study, inquiry metadata ([#41](https://github.com/efface-studio/Efface-Client/issues/41)) ([dac7d3a](https://github.com/efface-studio/Efface-Client/commit/dac7d3ab0e406761d3008a64ce594a93ba40d097))
* 보안 강화 — CSP 헤더, /api/apply origin 체크 엄격화 ([19b1707](https://github.com/efface-studio/Efface-Client/commit/19b1707fa99c4d2b7e5736e0abbee3ea7bbbae7d))
* 사이트 전체 i18n 적용 + 메일 파이프라인 보안 강화 ([ef1b29e](https://github.com/efface-studio/Efface-Client/commit/ef1b29e6c94c43ba529b6080a11e1cd90fa19366))
* 한/영 i18n 지원, 헤더·푸터 단순화, 슬로건 채택 ([4f0595a](https://github.com/efface-studio/Efface-Client/commit/4f0595a6650e1236ed01f83387bae47b5aed91c8))


### Bug Fixes

* **apply:** actionable client error when send-code returns 5xx ([#18](https://github.com/efface-studio/Efface-Client/issues/18)) ([4bb03a0](https://github.com/efface-studio/Efface-Client/commit/4bb03a0e1c1f72c7a9821c0a065f90d8afebd914))
* **apply:** catch Resend SDK throws so client gets a real error message ([#17](https://github.com/efface-studio/Efface-Client/issues/17)) ([1e832d9](https://github.com/efface-studio/Efface-Client/commit/1e832d972f526cf417b60b1d3d491861ae7f7354))
* **apply:** remove demo generation + bound Resend send with 7s timeout ([#19](https://github.com/efface-studio/Efface-Client/issues/19)) ([38b4ba9](https://github.com/efface-studio/Efface-Client/commit/38b4ba94ea62ec7c27f0accbf949d99450fb4feb))
* **estimator:** drop SEO from paid add-ons — it's included in every base ([#45](https://github.com/efface-studio/Efface-Client/issues/45)) ([c3789e6](https://github.com/efface-studio/Efface-Client/commit/c3789e6a81ae7e2244bb0ed70a6744d62c1abda4))
* **estimator:** show SEO as included (0원) instead of removing it ([#46](https://github.com/efface-studio/Efface-Client/issues/46)) ([a8694af](https://github.com/efface-studio/Efface-Client/commit/a8694afaa9fcc369eb70fdcee3e763fc4e20dba5))
* **hero:** client logos read as one trust row, not three awkward avatars ([#29](https://github.com/efface-studio/Efface-Client/issues/29)) ([3846284](https://github.com/efface-studio/Efface-Client/commit/3846284bb8d543dd36a2bb83b6985ed1288f676f))
* **hero:** smaller logo circles + object-contain so Hi-vits isn't cropped ([#32](https://github.com/efface-studio/Efface-Client/issues/32)) ([219cdd6](https://github.com/efface-studio/Efface-Client/commit/219cdd610bf49565fc2c9cf64645abb65d316339))
* overlapping logo circles + seamless marquee loop ([#31](https://github.com/efface-studio/Efface-Client/issues/31)) ([80d0151](https://github.com/efface-studio/Efface-Client/commit/80d0151ea27332d1e05764ecb7e9bf154eb8c746))
* privacy/terms 영문 번역, WordReveal descender 잘림 수정 ([419262c](https://github.com/efface-studio/Efface-Client/commit/419262ceee80766cf948399caf5f4ddf34b7834e))
* 커스텀 404/error 페이지, dead code 정리, DMARC + WAF rate limit ([9978a42](https://github.com/efface-studio/Efface-Client/commit/9978a425f39a53f441417848e77ee28350c68fef))


### Performance

* edge-cache marketing pages + drop blur from Reveal ([#34](https://github.com/efface-studio/Efface-Client/issues/34)) ([d905af4](https://github.com/efface-studio/Efface-Client/commit/d905af4a9d8e56c0b748e7e683f3ee92a19fa31b))
* **hero:** drop opacity-0 entry fades so SSR content is visible instantly ([#37](https://github.com/efface-studio/Efface-Client/issues/37)) ([b550979](https://github.com/efface-studio/Efface-Client/commit/b5509797b9113566cef0b3589b3089fc2a3453e7))
* **home:** add revalidate=300 for ISR caching ([b2c6684](https://github.com/efface-studio/Efface-Client/commit/b2c66842fe7e3b486da063520db1bfca0bdf6ee3))
* lazy-load FloatingCTA so it stays out of initial JS bundle ([#35](https://github.com/efface-studio/Efface-Client/issues/35)) ([2b4eabd](https://github.com/efface-studio/Efface-Client/commit/2b4eabdbd8c59e86bd6ce1c15eab852e4e6e7df7))
* Pretendard dynamic-subset + inline simpleicons SVGs ([#14](https://github.com/efface-studio/Efface-Client/issues/14)) ([62a38d7](https://github.com/efface-studio/Efface-Client/commit/62a38d7dde3883e8c48d1b5b1030de932869fac6))
* **send-code:** drop per-email count query to halve DB round trips ([#21](https://github.com/efface-studio/Efface-Client/issues/21)) ([7681829](https://github.com/efface-studio/Efface-Client/commit/76818291103c6745edc7560f56c6e86989d0c1d2))
* **send-code:** fire Resend send via after() to drop p50 to &lt;500ms ([#20](https://github.com/efface-studio/Efface-Client/issues/20)) ([166fc00](https://github.com/efface-studio/Efface-Client/commit/166fc002133a767cef4ce5bfee0b22bef7699a6b))
* 이미지 압축 · preconnect · AVIF · 라이지 로드 ([c5e078e](https://github.com/efface-studio/Efface-Client/commit/c5e078ecd4cf751e53f895826ca2fd8d1b94411f))
